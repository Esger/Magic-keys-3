import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class FooterCustomElement {

  constructor(eventAggregator) {
    this._eventAggregator = eventAggregator;
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

  _calcEffectiveness() {
    this.effectiveness = Math.round(100 * this.hitCount / (this.hitCount + this.missedCount));
  }

}
