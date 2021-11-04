import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class BoardCustomElement {
  constructor(eventAggregator, keysService) {
    this._eventAggregator = eventAggregator;
    this._keysService = keysService;
    this.maxKeys = 8;
    this.boardType = undefined;
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
    this._boardTypeSubscriber = this._eventAggregator.subscribe('boardType', alphaKeyCount => this._setBoardType(alphaKeyCount));
  }

  detached() {
    this._trainingReadySubscriber.dispose();
    this._keypressedSubscriber.dispose();
    this._boardTypeSubscriber.dispose();
  }

  _setBoardType(alphaKeyCount) {
    this.maxKeys = alphaKeyCount;
    this.boardType = 'board--' + alphaKeyCount + 'keys';
  }

  _resetSubset() {
    this.firstKey = 0;
    this.lastKey = this.maxKeys;
    // this._resetSubset();
    this._getSubset();
  }

  _getSubset() {
    const keys = [...this.keys, ...this.keys];
    let newSubset = keys.slice(this.firstKey, this.lastKey);
    console.table(newSubset);
    // replace only unneeded keys for new subset
    if (this.keySubset) {
      const currentSubset = JSON.parse(JSON.stringify(this.keySubset)); // deep copy to mark items to be replaced.
      const newKeyIndices = [];

      // Replace unneeded keys in currentSubset with new ones from newSubset
      currentSubset.forEach((key, index, subset) => {
        // console.log(key.name);
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

  _nextSubset() {
    if (this.lastKey > this.keys.length) {
      this.firstKey = this.lastKey % this.keys.length;
      this.lastKey = this.firstKey + this.maxKeys;
    } else {
      this.firstKey = this.lastKey;
      this.lastKey += this.maxKeys;
    }
  }

  keyIsPressed(key) {
    this._eventAggregator.publish('keyIsPressed', key);
    this._handleKey(key)
  }

  _handleKey(key) {
    switch (true) {
      case key.name == 'next':
        this._nextSubset();
        this.keySubset = this._getSubset();
        break;
      default:
        setTimeout(() => {
          this.keys = this._keysService.getKeys();
          this._resetSubset();
          this.keySubset = this._getSubset();
        });
        // console.table(this.keys)
      break;
    }
  }
}
