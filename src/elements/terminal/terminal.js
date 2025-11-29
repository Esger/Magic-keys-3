import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(Element, EventAggregator, KeysService)
export class TerminalCustomElement {
    @bindable isMobile;

    constructor(element, eventAggregator, keysService) {
        this._element = element;
        this._eventAggregator = eventAggregator;
        this._keysService = keysService;
        this.value = '';
        this._tailLength = this._keysService.getTailLength();
    }

    attached() {
        this._keypressedSubscriber = this._eventAggregator.subscribe('keyIsPressed', key => this._handleKey(key));
        this._clearOutputSubscriber = this._eventAggregator.subscribe('clearOutput', _ => this.clearOutput());
    }

    detached() {
        this._keypressedSubscriber.dispose();
        this._clearOutputSubscriber.dispose();
    }

    swipeStart(e) {
        this._startX = e.changedTouches[0].pageX;
        return true;
    }

    swipeEnd(event) {
        if (!this.isMobile) return;

        const endX = event.changedTouches[0].pageX;
        const diff = endX - this._startX;
        this._startX = endX;

        if (diff < -15) {
            this.backspace();
        }
        return true;
    }

    clearOutput() {
        this.value = '';
    }

    backspace() {
        this.value = this.value.slice(0, -1);
        const tail = this.value.slice(-this._tailLength);
        this._keysService.setTail(tail.toLocaleLowerCase());
        this._scrollToEnd();
    }

    _handleKey(key) {
        switch (true) {
            case key.name == 'shift':
                this._capsLock = this._capsLockPending;
                this._caps = !this._caps || this._capsLock;
                this._capsLockPending = true;
                setTimeout(() => {
                    this._capsLockPending = false;
                }, 300);
                break;
            case key.output?.length > 0:
                this.value = this._caps ? this.value + key.output.toUpperCase() : this.value + key.output;
                this._caps = this._capsLock;
                const tail = this.value.slice(-this._tailLength);
                this._keysService.registerKeystroke(tail.toLocaleLowerCase());
                break;
            case key.name == 'backspace':
                this.backspace();
                break;
            default: break;
        }
        this._scrollToEnd();
    }


    _scrollToEnd() {
        requestAnimationFrame(_ => this.terminal.scrollTop = this.terminal.scrollHeight);
    }
}
