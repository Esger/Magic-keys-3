import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BoardCustomElement {
  constructor(eventAggregator) {
    this._eventAggregator = eventAggregator;
    this._lastKeys = [];
    this.maxKeys = 8;
    this.keys = [
      {
        name: 'a',
        output: 'a',
        successors: [],
      },
      {
        name: 'b',
        output: 'b',
        successors: [],
      },
      {
        name: 'c',
        output: 'c',
        successors: [],
      },
      {
        name: 'd',
        output: 'd',
        successors: [],
      },
      {
        name: 'e',
        output: 'e',
        successors: [],
      },
      {
        name: 'f',
        output: 'f',
        successors: [],
      },
      {
        name: 'g',
        output: 'g',
        successors: [],
      },
      {
        name: 'h',
        output: 'h',
        successors: [],
      },
      {
        name: 'i',
        output: 'j',
        successors: [],
      },
      {
        name: 'k',
        output: 'k',
        successors: [],
      },
      {
        name: 'l',
        output: 'l',
        successors: [],
      },
      {
        name: 'm',
        output: 'm',
        successors: [],
      },
      {
        name: 'n',
        output: 'n',
        successors: [],
      },
      {
        name: 'o',
        output: 'o',
        successors: [],
      },
      {
        name: 'p',
        output: 'p',
        successors: [],
      },
      {
        name: 'q',
        output: 'q',
        successors: [],
      },
      {
        name: 'r',
        output: 'r',
        successors: [],
      },
      {
        name: 's',
        output: 's',
        successors: [],
      },
      {
        name: 't',
        output: 't',
        successors: [],
      },
      {
        name: 'u',
        output: 'u',
        successors: [],
      },
      {
        name: 'v',
        output: 'v',
        successors: [],
      },
      {
        name: 'v',
        output: 'v',
        successors: [],
      },
      {
        name: 'w',
        output: 'w',
        successors: [],
      },
      {
        name: 'x',
        output: 'x',
        successors: [],
      },
      {
        name: 'y',
        output: 'y',
        successors: [],
      },
      {
        name: 'z',
        output: 'z',
        successors: [],
      },
    ];
    this.modifiers = [
      {
        name: 'shift',
        display: '⇧',
        position: 'p0'
      },
      {
        name: 'numeric',
        display: '123',
        position: 'p1',
        className: 'small'
      },
      {
        name: 'symbols',
        position: 'p2',
        display: '@',
        className: 'small'
      },
      {
        name: 'brackets',
        display: '()',
        position: 'p3',
        className: 'small'
      },
      {
        name: 'backspace',
        display: '⇦',
        position: 'p4'
      },
      {
        name: 'next',
        display: '⇨',
        position: 'p5'
      },
      {
        name: 'dot',
        display: '.',
        output: '.',
        position: 'p6'
      },
      {
        name: 'enter',
        display: '↵',
        output: '\n',
        position: 'p7'
      },
      {
        name: 'comma',
        display: ',',
        output: ',',
        position: 'p8'
      },
      {
        name: 'space',
        display: ' ',
        output: ' ',
        position: 'p9'
      },
    ]
  }

  attached() {
    this._keyIsPressedSubscriber = this._eventAggregator.subscribe('', key => {
      key.output && this._registerKeyStrokes(key);
    });
  }
  
  detached() {
    this._keyIsPressedSubscriber.dispose();
  }

  _registerKeyStrokes(key) {
    
  }
}
