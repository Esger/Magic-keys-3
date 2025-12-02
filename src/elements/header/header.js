import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class headerCustomElement {
    @bindable isMobile;

    message = 'SmartKeys';

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    clear() {
        this._eventAggregator.publish('clearOutput');
    }

    attached() {
    }

}
