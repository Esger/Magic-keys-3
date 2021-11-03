import { inject } from "aurelia-framework";
import { KeysService } from "services/keys-service";

@inject(KeysService)
export class headerCustomElement {
  message = 'Magic Keys';
  depth = 1;

  constructor(keysService) {
    this._keyService = keysService;
    this.setDepth();
  }

  setDepth() {
    this._keyService.setTailLength(this.depth);
  }
}
