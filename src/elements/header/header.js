import { inject } from "aurelia-framework";
import { KeysService } from "services/keys-service";

@inject(KeysService)
export class headerCustomElement {
    message = 'Magic Keys';
    depth = undefined;

    constructor(keysService) {
        this._keyService = keysService;
        this.getDepth();
    }

    setDepth() {
        this._keyService.setTailLength(this.depth);
    }

    getDepth() {
        this.depth = this._keyService.getTailLength();
    }

}
