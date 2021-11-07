import { inject } from "aurelia-framework";
import { KeysService } from "services/keys-service";

@inject(KeysService)
export class headerCustomElement {
  message = 'Magic Keys';
  depth = undefined;
  alphaKeys = undefined;

  constructor(keysService) {
    this._keyService = keysService;
    this.getDepth();
  }

  attached() {
    this.getAlphaKeyCount();
  }

  setDepth() {
    this._keyService.setTailLength(this.depth);
  }

  getDepth() {
    this.depth = this._keyService.getTailLength();
  }

  setAlphaKeyCount() {
    this._keyService.setAlphaKeyCount(this.alphaKeys);
  }

  getAlphaKeyCount() {
    this.alphaKeys = this._keyService.getAlphaKeyCount();
  }

}
