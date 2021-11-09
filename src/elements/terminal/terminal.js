import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(Element, EventAggregator, KeysService)
export class TerminalCustomElement {

  constructor(element, eventAggregator, keysService) {
    this._element = element;
    this._eventAggregator = eventAggregator;
    this._keysService = keysService;
    this.value = '';
    this._tailLength = this._keysService.getTailLength();
  }

  attached() {
    this._keypressedSubscriber = this._eventAggregator.subscribe('keyIsPressed', key => this._handleKey(key));
  }

  detached() {
    this._keypressedSubscriber.dispose();
  }

  _handleKey(key) {
    switch (true) {
      case key.name == 'shift':
        this.caps = true;
        break;
      case key.output?.length > 0:
        this.value = this.caps ? this.value + key.output.toUpperCase() : this.value + key.output;
        this.caps = false;
        const tail = this.value.substr(-this._tailLength);
        this._keysService.registerKeystroke(tail);
        break;
      case key.name == 'backspace':
        this.value = this.value.slice(0, -1);
        break;
      default: break;
    }
  }

}
