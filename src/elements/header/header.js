import { inject } from "aurelia-framework";
import { KeysService } from "services/keys-service";

@inject(KeysService)
export class headerCustomElement {
  message = 'Magic Keys';
  depth = 1;
  alphaKeys = 8;

  constructor(keysService) {
    this._keyService = keysService;
    this.setDepth();
    this.setAlphaKeyCount();
  }

  setDepth() {
    this._keyService.setTailLength(this.depth);
  }

  setAlphaKeyCount() {
    this._keyService.setAlphaKeyCount(this.alphaKeys);
  }

}
