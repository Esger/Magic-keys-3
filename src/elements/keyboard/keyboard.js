import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

import { SettingsService } from "services/settings-service";

@inject(EventAggregator, KeysService, SettingsService)
export class KeyboardCustomElement {
    @bindable isMobile;
    constructor(eventAggregator, keysService, settingsService) {
        this._eventAggregator = eventAggregator;
        this._keysService = keysService;
        this._settingsService = settingsService;
        this._maxKeys = this._settingsService.getSetting('boardType', 8);
        this._keysService.setAlphaKeyCount(this._maxKeys);
        this.keys = this._keysService.getKeys();
        this.caps = false;
        this._resetKeysetType();
        this._previousKeysetTypes = [];
        this.pages = [];
        this.currentPage = 0;
        this._isResetting = false;
    }

    bind() {
        this._setBoardType(this._maxKeys);
    }

    isMobileChanged() {
        this._setBoardType(this._maxKeys);
    }

    attached() {
        this.modifiers = this._keysService.getKeys('modifiers');
        this.nonAlpha = this._keysService.getKeys('nonAlpha');
        this.numbers = this._keysService.getKeys('numbers');
        this.brackets = this._keysService.getKeys('brackets');
        this.symbols = this._keysService.getKeys('symbols');
        this.punctuation = this._keysService.getKeys('punctuation');
        this._trainingReadySubscriber = this._eventAggregator.subscribe('dataReady', _ => {
            this.keys = this._keysService.getKeys()
            this._updatePages();
        });
        this._boardTypeSubscriber = this._eventAggregator.subscribe('boardType', dynamicKeysAmount => this._setBoardType(dynamicKeysAmount));

        // Attach scroll listener if container is ready, or wait?
        // Aurelia's attached() is the place.
        if (this.scrollContainer) {
            this.scrollContainer.addEventListener('scroll', this._onScroll.bind(this));
        }
    }

    detached() {
        this._trainingReadySubscriber.dispose();
        this._boardTypeSubscriber.dispose();
        if (this.scrollContainer) {
            this.scrollContainer.removeEventListener('scroll', this._onScroll.bind(this));
        }
    }

    _onScroll() {
        if (this._isResetting) return;

        const width = this.scrollContainer.offsetWidth;
        const scrollLeft = this.scrollContainer.scrollLeft;
        // Use Math.round to handle potential sub-pixel scrolling or snap behavior
        const newPage = Math.round(scrollLeft / width);

        if (newPage !== this.currentPage) {
            this.currentPage = newPage;
            this.keyMissedCount++;
            this._eventAggregator.publish('keyMissed', (this.keyMissedCount));
        }
    }

    _updatePages() {
        this.pages = [];
        const keys = [...this.keys];
        // Ensure we have enough keys to fill pages if needed, or just display what we have
        // For alpha keys, we might want to show all available predictions

        // If we are in alpha mode, we want to show all predictions.
        // If we are in other modes, we just show the keys.

        const pageSize = this._maxKeys;
        for (let i = 0; i < keys.length; i += pageSize) {
            this.pages.push(keys.slice(i, i + pageSize));
        }

        if (this.pages.length > 0) {
            const lastPage = this.pages[this.pages.length - 1];
            let needed = pageSize - lastPage.length;
            let sourceIndex = 0;
            while (needed > 0 && keys.length > 0) {
                lastPage.push(keys[sourceIndex % keys.length]);
                sourceIndex++;
                needed--;
            }
        } else {
            this.pages.push([]);
        }

        if (this.scrollContainer) {
            this._isResetting = true;
            this.scrollContainer.scrollLeft = 0;
            // Use setTimeout to allow the scroll event to fire (if it does synchronously) or just clear flag after a tick
            // Actually scrollLeft assignment is synchronous but the event might be async. 
            // RequestAnimationFrame is safer to clear the flag.
            requestAnimationFrame(() => {
                this._isResetting = false;
                this.currentPage = 0;
            });
        }
    }

    _setBoardType(amount) {
        this._maxKeys = parseInt(amount, 10);
        const mobile = this.isMobile && this._maxKeys == 8 ? 'mobile--' : '';
        this.boardType = 'board--' + mobile + amount + 'keys';
        this.keyHitCount = 0;
        this.keyMissedCount = 0;
        this._resetKeysetType();
        this._updatePages();
    }

    _resetKeysetType() {
        this.keysetType = 'alpha';
    }

    _setKeysetType(type) {
        this._previousKeysetTypes.push(this.keysetType);
        this.keysetType = type;
    }

    _toggleKeysetType(type) {
        if (type === this.keysetType) {
            this.keysetType = this._previousKeysetTypes.pop();
        } else {
            this._previousKeysetTypes.push(this.keysetType);
            this.keysetType = type;
        }
    }

    _removeFromSet(set, key) {
        let newSet = set;
        const index = newSet.findIndex(k => k.name == key.name);
        if (index > -1) {
            newSet.splice(index, 1);
        }
        return newSet;
    }

    keyIsPressed(key) {
        if (this._isSwiping) {
            this._isSwiping = false;
            return;
        }
        this._eventAggregator.publish('keyIsPressed', key);
        this._handleKey(key)
    }

    swipeStart(event, key) {
        if (!this.isMobile) return true;
        this._startY = event.changedTouches[0].pageY;
        this._startX = event.changedTouches[0].pageX;
        this._isSwiping = false;
        return true;
    }

    swipeEnd(event, key) {
        if (!this.isMobile) return true;
        const endY = event.changedTouches[0].pageY;
        const endX = event.changedTouches[0].pageX;
        const diffY = this._startY - endY;
        const diffX = Math.abs(this._startX - endX);

        if (diffY > 30 && diffY > diffX) {
            this._isSwiping = true;
            if (this.keysetType === 'alpha' && key.output && key.output.match(/[a-z]/)) {
                const upperKey = { ...key, output: key.output.toUpperCase() };
                this._eventAggregator.publish('keyIsPressed', upperKey);
                this._handleKey(upperKey);
            }
        }
        return true;
    }

    _handleKey(key) {
        switch (true) {
            case key.name == 'shift':
                this._capsLock = this._capsLockPending;
                this.caps = !this.caps || this._capsLock;
                this._capsLockPending = true;
                setTimeout(() => {
                    this._capsLockPending = false;
                }, 300);
                break;
            case key.name == 'next':
                let next = this.currentPage + 1;
                if (next >= this.pages.length) {
                    next = 0;
                }
                const pages = this.scrollContainer.querySelectorAll('.keys-page');
                if (pages[next]) {
                    pages[next].scrollIntoView();
                }
                break;
            case ['brackets', 'numeric', 'symbols', 'punctuation'].includes(key.name):
                this._toggleKeysetType(key.name);
                break;
            default:
                this.caps = this._capsLock;
                this.keys = this._keysService.getKeys(this.keysetType);
                if (this.keysetType == 'alpha') {
                    this._updatePages();
                }
                key.output?.length && this.keyHitCount++;
                this._eventAggregator.publish('keyHit', (this.keyHitCount));
                break;
        }
    }
}
