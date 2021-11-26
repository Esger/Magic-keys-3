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
}
