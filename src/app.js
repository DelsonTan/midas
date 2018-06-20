import autobind from 'autobind-decorator';
import React from 'react';
import { Spinach, Iron, Tin, Lead, Gold } from './models/resources.js';
import _items from './models/items';
import Apprentice from './models/apprentices.js';
import { Counter, Button } from './views/lib';
import Shop from './views/shop';
import Help from './views/help';
import Industry from './views/industry';
import { SpinachGarden, IronMine, TinMine } from './models/industries';
import Alchemy from './views/alchemy';

require('./styles/style.css');

window.debug = window.debug || {};      // debugging hackery

class App extends React.Component {
  constructor() {
    super();
    const fu = this.forceUpdate.bind(this);
    this.RPOT = new RelentlessPassageOfTime(fu);
    this.state = {
      resources: {
        spinach: new Spinach(fu),
        iron: new Iron(fu),
        tin: new Tin(fu),
        lead: new Lead(fu),
        gold: new Gold(fu),
      },
      industries: {
        spinachGarden: new SpinachGarden(this.RPOT, fu),
        ironMine: new IronMine(this.RPOT, fu),
        tinMine: new TinMine(this.RPOT, fu),
      },
      items: {},
      apprentices: [],
      maxGold: 0,
      amAssigning: false,
    };
    this.state.items = _items(fu, this.state);
    this.state.resources.lead.setQuantity(10);
    this.RPOT.run();

    // debugging hackery
    window.globalState = this.state;
  }

  @autobind
  hireApprentice() {
    this.setState({apprentices: [...this.state.apprentices, new Apprentice(this.RPOT)]});
  }

  transmute(from, to) {
    if (from.transmute(to)) {
      to.incrementBy(1);
    }
  }

  @autobind
  assign_toggle(appr) {
    if (!this.state.amAssigning) {
      this.setState({
        amAssigning: appr,
        pending_assignment: []
      });
    } else {
      this.assign_finish(appr, this.state.pending_assignment);
      this.setState({
        amAssigning: false,
        pending_assignment: []
      });
    }
  }

  assign_finish(appr, proposed_assignments) {
    appr.assign(proposed_assignments);
  }

  @autobind
  assign_append(fn) {
    this.setState({pending_assignment: [...this.state.pending_assignment, fn]});
  }

  componentWillUpdate() {
    const [current, max] = [this.state.resources.gold.quantity, this.state.maxGold];
    this.state.maxGold =  Math.max(current, max);
  }

  render() {
    return (
      <div className='container-v'>
        <h1>Resources</h1>
        <div className='container'>
          {Object.values(this.state.resources).map(resource => {
            return <ResourcePanel
              key={resource.name}
              resource={resource}
              resources={this.state.resources}
              transmute={this.transmute}
              assigning={this.state.amAssigning ? this.assign_append : undefined}
            />
          })}
        </div>
        <Shop items={this.state.items} />
        <Help
          apprentices={this.state.apprentices}
          onHire={this.hireApprentice}
          onAssign={this.assign_toggle}
          currentAssignee={this.state.amAssigning.id}
        />
        <Industry
          industries={this.state.industries}
          resources={this.state.resources}
          />
        <Alchemy />
      </div>
    );
  };
};

class ResourcePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.refs.transTarget && Object.keys(this.props.resource.transmutationTargets).length > 0) {
      const firstTarget = this.refs.transTarget.value || '';
      this.setState({transmuteTarget: firstTarget});
    }
  }

  dropdownChange(e) {
    this.setState({transmuteTarget: e.target.value});
  }

  render() {
    const {resource, resources, transmute} = this.props;
    return (
      <div className={`panel ${resource.name}`}>
        <Counter label={resource.label} quantity={resource.quantity} />
        {resource.name === 'gold' && <p>{`Total produced: ${resource.produced}`}</p>}
        {
          resource.find &&
          <Button
            label={`${resource.verb} (${resource.findVolume})`}
            clickAction={resource.find}
            assigning={this.props.assigning}
          />
        }
        {
          Object.keys(resource.transmutationTargets).length > 0 &&
          <div className='transmute-box'>
            <Button
              inactive={!resource.canTransmuteTo(resources[this.state.transmuteTarget])}
              label={'Transmute to...'}
              clickAction={() => {
                transmute(resource, resources[this.state.transmuteTarget])
              }}
            />
            <select ref='transTarget' onChange={(e) => this.dropdownChange(e)}>
              {Object.entries(resource.transmutationTargets).map(target => {
                const [name, value] = target;
                return (<option key={name} value={name}>{`${resources[name].label} (${value})`}</option>)
              })}
            </select>
          </div>
        }
      </div>
    );
  };
}

class RelentlessPassageOfTime {
    constructor(forceUpdate) {
        this.forceUpdate = forceUpdate;
        this.subscribers = [];
    }

    run() {
        const _run = this.run.bind(this);
        const requireUpdate = this.subscribers.reduce((acc, subscriber) => subscriber.tick(window.performance.now()) || acc, false);
        if (requireUpdate) this.forceUpdate();
        requestAnimationFrame(_run);
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }
}

export default App;
