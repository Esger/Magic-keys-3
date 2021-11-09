import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class KeyboardCustomElement {
  constructor(eventAggregator, keysService) {
    this._eventAggregator = eventAggregator;
    this._keysService = keysService;
    this.maxKeys = 9;
    this._keysService.setAlphaKeyCount(this.maxKeys);
    this.keys = this._keysService.getKeys();
    this.modifiers = this._keysService.getModifiers();
    this._setBoardType(this.maxKeys);
    this.caps = false;
  }

  attached() {
    this._trainingReadySubscriber = this._eventAggregator.subscribe('dataReady', _ => {
      this.keys = this._keysService.getKeys()
      this.keySubset = this._getSubset();
    });
    this._boardTypeSubscriber = this._eventAggregator.subscribe('boardType', dynamicKeysAmount => this._setBoardType(dynamicKeysAmount));
  }

  detached() {
    this._trainingReadySubscriber.dispose();
    this._boardTypeSubscriber.dispose();
  }

  _setBoardType(amount) {
    this.maxKeys = parseInt(amount, 10);
    this.boardType = 'board--' + amount + 'keys';
    this.keyHitCount = 0;
    this.keyMissedCount = 0;
    this._resetSubset();
  }

  _resetSubset() {
    this.firstKey = 0;
    this.lastKey = this.maxKeys;
    this.keySubset = this._getSubset();
  }

  _getSubset() {
    const keys = [...this.keys, ...this.keys];
    let newSubset = keys.slice(this.firstKey, this.lastKey);

    // there's no keySubset the first time
    if (this.keySubset) {

      let currentSubset = JSON.parse(JSON.stringify(this.keySubset)) || []; // deep copy to mark items to be replaced.

      // remove keys when switched to smaller keyboard
      if (currentSubset.length && currentSubset.length > newSubset.length) {
        currentSubset.length = newSubset.length;
      }

      // replace only unneeded keys in currentSubset
      newSubset.forEach((key, index, subset) => {
        key.needed = !currentSubset.some(k => k.name == key.name);
        if (key.needed) {
          let replaceKeyIndex = currentSubset.findIndex(k => !subset.some(kk => kk.name == k.name));
          if (replaceKeyIndex > -1) {
            currentSubset[replaceKeyIndex] = key;
          } else
            // add key when switched to larger keyboard
            if (currentSubset.length && currentSubset.length < subset.length) {
              currentSubset.push(key);
            }
        }
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
    if (this.lastKey >= this.keys.length) {
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
      case key.name == 'shift':
        this.caps = !this.caps;
        break;
      case key.name == 'next':
        this._nextSubset();
        this.keySubset = this._getSubset();
        this.keyMissedCount++;
        this._eventAggregator.publish('keyMissed', (this.keyMissedCount));
        break;
      default:
        this.caps = false;
        this.keys = this._keysService.getKeys();
        this._resetSubset();
        this.keySubset = this._getSubset();
        key.output?.length && this.keyHitCount++;
        this._eventAggregator.publish('keyHit', (this.keyHitCount));
        // console.table(this.keys)
        break;
    }
  }
}
