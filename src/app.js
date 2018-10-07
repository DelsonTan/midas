import autobind from 'autobind-decorator';
import React from 'react';

require('./styles/style.css');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // Mock map objects
      items: [
        { id: 12345, pos: { x: 150, y: 280 }, color: '#3399BB', icon: '🏠',
          clickAction: () => this.changeModalTo(12345),
          modalData: 'A house'
        },
        { id: 333, pos: { x: 460, y: 140 }, color: '#99BB33', icon: '⛪️',
          clickAction: () => this.changeModalTo(333),
          modalData: 'A church'
        },
        { id: 9000, pos: { x: 860, y: 440 }, color: '#BB3399', icon: '🏪',
          clickAction: () => this.changeModalTo(9000),
          modalData: 'A 24 store'
        },
      ],
      modalTarget: null,
    };
  }

  @autobind
  changeModalTo(id) {
    this.setState(prev => ({modalTarget: id === prev.modalTarget ? null : id}));
  }

  render() {
    const modalItem = this.state.items.find(item => item.id === this.state.modalTarget);
    return (
      <div className='game-main'>
        <Map items={this.state.items} onClick={this.changeModalTo.bind(null, null)} />
        <Sidebar items={this.state.items} />
        {this.state.modalTarget ? <TheModal item={modalItem} /> : null}
      </div>
    );
  }
}

class Map extends React.Component {
  render() {
    return (
      <div className='map'>
        <svg className='map-svg' onClick={this.props.onClick} xmlns="http://www.w3.org/2000/svg">
          { this.props.items.map(item => <MapIcon key={item.id} item={item}/>) }
        </svg>
      </div>
    );
  }
}

class MapIcon extends React.Component {
  render() {
    const { id, color, icon, pos, clickAction } = this.props.item;
    return (
      <circle onClick={(e) => {
        e.stopPropagation();
        clickAction();
      }}
      cx={pos.x}
      cy={pos.y}
      r="10"
      style={{ fill: color }}>
        {icon} {/* TODO: Make this show up */}
      </circle>
    )
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div className='sidebar container-v' style={{border: '1px solid black'}}>
        { this.props.items.map(item => <SidebarItem key={item.id} item={item} />) }
      </div>
    )
  }
}

class SidebarItem extends React.Component {
  render() {
    const { id, color, icon, clickAction, modalData } = this.props.item;
    return (
      <div onClick={clickAction} className='sidebar-item' style={{backgroundColor: color, minWidth: '100px'}}>
        <p>{icon} {modalData} {icon}</p>
      </div>
    );
  }
}

class TheModal extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <div className={`the-modal`} style={{backgroundColor: item.color}}>
        <h1>{item.modalData}</h1>
      </div>
    )
  }
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
