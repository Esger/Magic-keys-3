import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class MenuCustomElement {
    @bindable isMobile;

    constructor(eventAggregator, keysService) {
        this._eventAggregator = eventAggregator;
        this._keyService = keysService;
        this.settings = {
            menuVisible: false,
            menuDisabled: false,
            submenuBoardsVisible: false,
            submenuDepthVisible: false,
            submenuLanguageVisible: false,
            currentDepth: undefined
        };
        this.boardTypes = this._keyService.getBoardTypes();
        this.depths = [1, 2, 3, 4, 5];
    }

    attached() {
        this._$html = $('html');
        this.getDepth();
        this.getAlphaKeyCount();
        this._boardTypeSubscription = this._eventAggregator.subscribe('boardType', count => {
            this.settings.currentBoardType = count;
        });
    }

    detached() {
        this._boardTypeSubscription.dispose();
    }

    showTheMenu(event) {
        this._$html.on('click.closeMenu', event => {
            const clickInside = $(event.target).closest('.menu').length > 0;
            !clickInside && this.hideTheMenu();
        });
        this.settings.menuVisible = true;
        this.settings.submenuBoardsVisible = false;
        this.settings.submenuLanguageVisible = false;
    }

    hideTheMenu() {
        this._$html.off('click.closeMenu');
        setTimeout(_ => {
            this.settings.menuVisible = false;
            this.settings.submenuBoardsVisible = false;
            this.settings.submenuDepthVisible = false;
            this.settings.submenuLanguageVisible = false;
        });
    }

    toggleSubmenuBoards() {
        this.settings.submenuBoardsVisible = !this.settings.submenuBoardsVisible;
        this.settings.submenuDepthVisible = false;
        this.settings.submenuLanguageVisible = false;
        return false;
    }

    toggleSubmenuDepth() {
        this.settings.submenuDepthVisible = !this.settings.submenuDepthVisible;
        this.settings.submenuBoardsVisible = false;
        this.settings.submenuLanguageVisible = false;
        return false;
    }

    toggleSubmenuLanguage() {
        this.settings.submenuLanguageVisible = !this.settings.submenuLanguageVisible;
        this.settings.submenuBoardsVisible = false;
        this.settings.submenuDepthVisible = false;
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

    setLanguage(lang) {
        this._keyService.setLanguage(lang);
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
