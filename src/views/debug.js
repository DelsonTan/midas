import React from 'react';
import { Button, Counter } from './lib';

export default class Debug extends React.Component {
  constructor(props) {
    super(props);
    this.open = false;
  }

  setGoldTo() {
    window.globalState.resources.gold.quantity = this.refs.goldQuant.value;
  }

  toggle() {
    this.open = !this.open;
  }

  render() {
    const open = this.open ? '' : 'closed';
    return (
        <div className={`debug ${open}`}>
            <p className='toggle' onClick={() => this.toggle()}>{this.open ? '𝐗' : '🐛'}</p>
            <div className='fields'>
              <div>
                <input ref='goldQuant' type='number'></input><button onClick={() => this.setGoldTo()}>Set Gold</button>
              </div>
            </div>
        </div>
    );
  };
};
