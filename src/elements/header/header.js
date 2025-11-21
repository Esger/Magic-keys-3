import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class headerCustomElement {

    message = 'Magic Keys';

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    clear() {
        this._eventAggregator.publish('clearOutput');
    }

    attached() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    swipeStart(e) {
        this.startX = e.changedTouches[0].pageX;
    }

    swipeEnd(e) {
        const endX = e.changedTouches[0].pageX;
        this.swipeEnabled = endX - this.startX > 50;
        this._eventAggregator.publish('swipeEnabled', this.swipeEnabled);
    }
}
