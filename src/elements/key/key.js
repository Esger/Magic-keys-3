import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class KeyCustomElement {
  @bindable key
  @bindable display
  @bindable className
  constructor(eventAggregator) {
    this._eventAggregator = eventAggregator;
  }
  keyIsPressed() {
    this._eventAggregator.publish('keyIsPressed', this.key);
  }
}
