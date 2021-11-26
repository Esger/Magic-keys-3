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
            submenuDepthVisible: false,
            currentBoardType: undefined,
            currentDepth: undefined
        };
        this.boardTypes = [
            { name: '8 keys', keyAmount: '8' },
            { name: '9 keys', keyAmount: '9' },
        ];
        this.depths = [1, 2, 3, 4, 5];
    }

    attached() {
        this._$html = $('html');
        this.getDepth();
        this.getAlphaKeyCount();
    }

    showTheMenu(event) {
        this._$html.on('click.closeMenu', event => {
            const clickInside = event.target.closest('menu')?.length > 0;
            !clickInside && this.hideTheMenu();
        });
        this.settings.menuVisible = true;
        this.settings.submenuBoardsVisible = false;
    }

    hideTheMenu() {
        this._$html.off('click.closeMenu');
        setTimeout(_ => {
            this.settings.menuVisible = false;
            this.settings.submenuBoardsVisible = false;
            this.settings.submenuDepthVisible = false;
        });
    }

    toggleSubmenuBoards() {
        this.settings.submenuBoardsVisible = !this.settings.submenuBoardsVisible;
        this.settings.submenuDepthVisible = false;
        return false;
    }

    toggleSubmenuDepth() {
        this.settings.submenuDepthVisible = !this.settings.submenuDepthVisible;
        this.settings.submenuBoardsVisible = false;
        return false;
    }

    setKeyAmount(amount) {
        this.settings.currentBoardType = amount;
        this._keyService.setAlphaKeyCount(amount);
        this.hideTheMenu();
    }

    getAlphaKeyCount() {
        this.settings.currentBoardType = this._keyService.getAlphaKeyCount();
    }

    setDepth(depth) {
        this.settings.currentDepth = depth;
        this._keyService.setTailLength(depth);
        this.hideTheMenu();
    }

    getDepth() {
        this.settings.currentDepth = this._keyService.getTailLength();
    }

    resetData() {
        this._keyService.resetData();
        this._eventAggregator.subscribeOnce('dataReady', _ => this.getDepth());
    }

    cleanData() {
        this._keyService.cleanData();
    }

}
