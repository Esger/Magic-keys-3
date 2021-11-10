import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)

export class MenuCustomElement {

    constructor(eventAggregator, keysService) {
        this._eventAggregator = eventAggregator;
        this._keyService = keysService;
        this.settings = {
            menuVisible: false,
            menuDisabled: false,
            submenuBoardsVisible: false,
        };
        this.boardTypes = [
            { name: '8 keys', keyAmount: '8' },
            { name: '9 keys', keyAmount: '9' },
        ];
    }

    attached() {
        this._$body = $('body');
    }

    showTheMenu(event) {
        this._$body.on('click.closeMenu', event => {
            const clickInside = event.target.closest('menu')?.length > 0;
            !clickInside && this.hideTheMenu();
        });
        this.settings.menuVisible = true;
        this.settings.submenuBoardsVisible = false;
    }

    hideTheMenu() {
        this._$body.off('click.closeMenu');
        setTimeout(_ => {
            this.settings.menuVisible = false;
        });
    }

    toggleSubmenuBoards() {
        this.settings.submenuBoardsVisible = !this.settings.submenuBoardsVisible;
        return false;
    }

    setKeyAmount(amount) {
        this.alphaKeys = amount;
        this._keyService.setAlphaKeyCount(amount);
    }

    getAlphaKeyCount() {
        this.alphaKeys = this._keyService.getAlphaKeyCount();
    }

}
