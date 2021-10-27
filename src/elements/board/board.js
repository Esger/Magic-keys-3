import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class BoardCustomElement {
  constructor(eventAggregator, keysService) {
    this._eventAggregator = eventAggregator;
    this._keysService = keysService;
    this.maxKeys = 8;
    this.firstKey = 0;
    this.lastKey = this.maxKeys;
    this.keys = this._keysService.getKeys();
    this.keySubset = this._getSubset();
    this.modifiers = this._keysService.getModifiers();
  }

  attached() {
    this._keypressedSubscriber = this._eventAggregator.subscribe('keyIsPressed', key => this._handleKey(key));
  }

  detached() {
    this._keypressedSubscriber.dispose();
  }

  _getSubset() {
    const keys = [...this.keys, ...this.keys];
    let subset = keys.slice(this.firstKey, this.lastKey);
    return subset;
  }
  
  _shiftStartEnd() {
    if (this.lastKey > this.keys.length) {
      this.firstKey = this.lastKey % this.keys.length;
      this.lastKey = this.firstKey + this.maxKeys;
    } else {
      this.firstKey = this.lastKey;
      this.lastKey += this.maxKeys;
    }  
  }
  
  _handleKey(key) {
    switch (true) {
      case key.name == 'next':
        this._shiftStartEnd();
        this.keySubset = this._getSubset();
        break;
      default: break;
    }
  }
}
