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
        this._clearOutputSubscriber = this._eventAggregator.subscribe('clearOutput', _ => this._clearOutput());
    }

    detached() {
        this._keypressedSubscriber.dispose();
        this._clearOutputSubscriber.dispose();
    }

    _clearOutput() {
        this.value = '';
    }

    _handleKey(key) {
        switch (true) {
            case key.name == 'shift':
                this.capsLock = this.capsLockPending;
                this.caps = !this.caps || this.capsLock;
                this.capsLockPending = true;
                setTimeout(() => {
                    this.capsLockPending = false;
                }, 300);
                break;
            case key.output?.length > 0:
                this.value = this.caps ? this.value + key.output.toUpperCase() : this.value + key.output;
                this.caps = this.capsLock;
                const tail = this.value.substr(-this._tailLength);
                this._keysService.registerKeystroke(tail.toLocaleLowerCase());
                break;
            case key.name == 'backspace':
                this.value = this.value.slice(0, -1);
                break;
            default: break;
        }
    }

}
