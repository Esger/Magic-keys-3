import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class FooterCustomElement {

  constructor(eventAggregator, keysService) {
    this._eventAggregator = eventAggregator;
    this._keyService = keysService;
    this.hitCount = 0;
    this.missedCount = 0;
  }

  attached() {
    this._hitCountSubscriber = this._eventAggregator.subscribe('keyHit', count => {
      this.hitCount = count;
      this._calcEffectiveness();
    });
    this._missedCountSubscriber = this._eventAggregator.subscribe('keyMissed', count => {
      this.missedCount = count;
      this._calcEffectiveness();
    });
  }
  
  detached() {
    this._hitCountSubscriber.dispose();
    this._missedCountSubscriber.dispose();
  }

  resetData() {
    this._keyService.resetData();
  }
  
  cleanData() {
    this._keyService.cleanData();
  }

  _calcEffectiveness() {
    this.effectiveness = Math.round(100 * this.hitCount / (this.hitCount + this.missedCount));
  }

}
