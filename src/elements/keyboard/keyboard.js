import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

@inject(EventAggregator, KeysService)
export class KeyboardCustomElement {
    @bindable isMobile;
    constructor(eventAggregator, keysService) {
        this._eventAggregator = eventAggregator;
        this._keysService = keysService;
        this.maxKeys = 8;
        this._keysService.setAlphaKeyCount(this.maxKeys);
        this.keys = this._keysService.getKeys();
        this.caps = false;
        this._resetKeysetType();
        this._previousKeysetTypes = [];
        this.pages = [];
        this.currentPage = 0;
        this.isResetting = false;
    }

    bind() {
        this._setBoardType(this.maxKeys);
    }

    isMobileChanged() {
        this._setBoardType(this.maxKeys);
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
        if (this.isResetting) return;

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

        const pageSize = this.maxKeys;
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
            this.isResetting = true;
            this.scrollContainer.scrollLeft = 0;
            // Use setTimeout to allow the scroll event to fire (if it does synchronously) or just clear flag after a tick
            // Actually scrollLeft assignment is synchronous but the event might be async. 
            // RequestAnimationFrame is safer to clear the flag.
            requestAnimationFrame(() => {
                this.isResetting = false;
                this.currentPage = 0;
            });
        }
    }

    _setBoardType(amount) {
        this.maxKeys = parseInt(amount, 10);
        const mobile = this.isMobile && this.maxKeys == 8 ? 'mobile--' : '';
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

    isKeysetOftype(type) {
        return this.keysetType === type;
    }

    _resetSubset() {
        this._updatePages();
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
        this._eventAggregator.publish('keyIsPressed', key);
        this._handleKey(key)
    }

    _handleKey(key) {
        switch (true) {
            case key.name == 'shift':
                this.capsLock = this.capsLockPending;
                this.caps = !this.caps || this.capsLock;
                this.capsLockPending = true;
                setTimeout(() => {
                    this.capsLockPending = false;
                }, 300);
                break;
            case key.name == 'prev':
                this._resetKeysetType();
                this._previousSubset();
                this.keySubset = this._getAlphaSubset();
                this.keyMissedCount++;
                this._eventAggregator.publish('keyMissed', (this.keyMissedCount));
                break;
            case key.name == 'next':
                this._resetKeysetType();
                this._nextSubset();
                this.keySubset = this._getAlphaSubset();
                this.keyMissedCount++;
                this._eventAggregator.publish('keyMissed', (this.keyMissedCount));
                break;
            case ['brackets', 'numeric', 'symbols', 'punctuation'].includes(key.name):
                this._toggleKeysetType(key.name);
                break;
            default:
                this.caps = this.capsLock;
                this.keys = this._keysService.getKeys(this.keysetType);
                if (this.keysetType == 'alpha') {
                    this._resetSubset();
                }
                key.output?.length && this.keyHitCount++;
                this._eventAggregator.publish('keyHit', (this.keyHitCount));
                // console.table(this.keys)
                break;
        }
    }
}
