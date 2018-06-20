import React from 'react';
import { Button, Counter } from './lib';

export default class Industries extends React.Component {
  constructor(props) {
    super(props);
    this.industries = this.props.industries;
    this.resources = this.props.resources;
  }

  render() {
    return (
        <div className='container-v'>
          <h1>Industries</h1>
          <div className='container industry'>
            {Object.entries(this.industries).map(industry => <IndustryPanel key={industry[1].name} resources={this.resources} industry={industry[1]}/>)}
          </div>
        </div>
    );
  };
};

class IndustryPanel extends React.Component {
  render() {
    const industry = this.props.industry;
    const resources = this.props.resources;

    if (industry.maxQuantity) {
      return (
        <div className={`panel ${industry.targetResource}`}>
          <Counter label={industry.label} quantity={industry.quantity} />
          <Button
            label='Collect'
            clickAction={industry.collect.bind(industry, resources[industry.targetResource])}
          />
          <Counter label='Max' quantity={industry.maxQuantity} />
          <Button
            label='Expand'
            clickAction={industry.build.bind(industry)}
          />
        </div>
      );
    } else {
      return (
        <div className={`panel ${industry.targetResource}`}>
          <Button
            inactive={resources['gold'].quantity < industry.costToBuild}
            label={`Build ${industry.label}`}
            clickAction={industry.build.bind(industry, resources['gold'])}
          />
        </div>
      );
    }
  };
};
