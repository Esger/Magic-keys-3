import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";
import { SettingsService } from "services/settings-service";

@inject(EventAggregator, KeysService, SettingsService)
export class MenuCustomElement {
    @bindable isMobile;

    constructor(eventAggregator, keysService, settingsService) {
        this._eventAggregator = eventAggregator;
        this._keyService = keysService;
        this._settingsService = settingsService;
        this.settings = {
            menuDisabled: false,
            currentDepth: undefined
        };
        this.boardTypes = this._keyService.getBoardTypes();
        this.depths = [1, 2, 3, 4, 5];
    }

    attached() {
        this._$html = $('html');
        this.getDepth();
        this.getAlphaKeyCount();
        this.getAlphaKeyCount();
        this.getLanguage();
        this.getLayout();
        this._boardTypeSubscription = this._eventAggregator.subscribe('boardType', count => {
            this.settings.currentBoardType = count;
        });
    }

    detached() {
        this._boardTypeSubscription.dispose();
    }

    hideTheMenu() {
        document.getElementById('main-menu').hidePopover();
        this.closeOtherSubmenus();
    }

    closeOtherSubmenus() {
        // Submenus close automatically via popover light dismiss or we can force close them if needed
        // document.querySelectorAll('.subMenu').forEach(el => el.hidePopover());
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

    getLanguage() {
        this.settings.currentLanguage = this._settingsService.getSetting('language');
    }

    setLanguage(lang) {
        this.settings.currentLanguage = lang;
        this._keyService.setLanguage(lang);
        this.hideTheMenu();
    }

    getLayout() {
        this.settings.currentLayout = this._settingsService.getSetting('layout', 'smart');
    }

    setLayout(mode) {
        this.settings.currentLayout = mode;
        this._settingsService.setSetting('layout', mode);
        this._eventAggregator.publish('layoutMode', mode);
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
