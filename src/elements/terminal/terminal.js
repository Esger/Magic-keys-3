import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator)
export class TerminalCustomElement{
  constructor(element, eventAggregator) {
    this._element = element;
    this._eventAggregator = eventAggregator;
    this._keypressedSubscriber = this._eventAggregator.subscribe('keyIsPressed', key => {
      key.output && this._addKeyToOutput(key.output);
    });
  }

  attached() {
    this.value = '';
  }
  
  detached() {
    this._keypressedSubscriber.dispose();
  }
  
  _addKeyToOutput(char) {
    this.value += char;
  }
}
