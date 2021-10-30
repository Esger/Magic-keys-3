import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class BoardCustomElement {
  constructor(eventAggregator, keysService) {
    this._eventAggregator = eventAggregator;
    this._keysService = keysService;
    this.maxKeys = 8;
    this._resetSubset();
    this.keys = this._keysService.getKeys();
    this.keySubset = this._getSubset();
    this.modifiers = this._keysService.getModifiers();
  }
  
  attached() {
    this._trainingReadySubscriber = this._eventAggregator.subscribe('trainingReady', _ => {
      setTimeout(() => {
        this.keys = this._keysService.getKeys()
        this.keySubset = this._getSubset();
      });
    });
    this._keypressedSubscriber = this._eventAggregator.subscribe('keyIsPressed', key => this._handleKey(key));
  }

  detached() {
    this._keypressedSubscriber.dispose();
    this._trainingReadySubscriber.dispose();
  }

  _resetSubset() {
    this.firstKey = 0;
    this.lastKey = this.maxKeys;
  }

  _getSubset() {
    const keys = [...this.keys, ...this.keys];
    let newSubset = keys.slice(this.firstKey, this.lastKey);
    if (this.keySubset) {
      const currentSubset = JSON.parse(JSON.stringify(this.keySubset)); // deep copy to mark items to be replaced.
      const newKeyIndices = [];
      currentSubset.forEach((key, index, subset) => {
        const isNewKey = !newSubset.some(k => k.name == key.name);
        if (isNewKey) {
          key.replace = true;
        } else {
          newSubset = this._removeFromSet(newSubset, key);
        }
      });
      newSubset.forEach((key, index, subset) => {
        const newKeyIndex = currentSubset.findIndex(k => k.replace == true);
        currentSubset[newKeyIndex] = key;
      });
      return currentSubset;
    }
    return newSubset;
  }

  _removeFromSet(set, key) {
    let newSet = set;
    const index = newSet.findIndex(k => k.name == key.name);
    if (index > -1) {
      newSet.splice(index, 1);
    }
    return newSet;
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
        break;
      case key.output?.length > 0:
        this.keys = this._keysService.getKeys(key.output);
        this._resetSubset();
      default: break;
    }
    this.keySubset = this._getSubset();
  }
}
