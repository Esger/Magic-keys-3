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
        const oldPage0 = this.pages[0] || [];
        const newKeys = [...this.keys];
        const pageSize = this._maxKeys;

        // Initialize newPage0 with nulls
        const newPage0 = new Array(pageSize).fill(null);
        const remainingKeys = [];

        // Preserve Phase: Keep existing keys in their spots
        // We need to match by name to ensure identity
        // We iterate through newKeys to see which ones can be placed
        const placedIndices = new Set();

        // First pass: Place keys that were already on page 0
        newKeys.forEach(key => {
            const oldIndex = oldPage0.findIndex(k => k.name === key.name);
            if (oldIndex !== -1 && oldIndex < pageSize) {
                newPage0[oldIndex] = key;
                placedIndices.add(key.name);
            } else {
                remainingKeys.push(key);
            }
        });

        // Fill Phase: Fill empty spots with remaining keys
        let remainingIndex = 0;
        for (let i = 0; i < pageSize; i++) {
            if (newPage0[i] === null) {
                if (remainingIndex < remainingKeys.length) {
                    newPage0[i] = remainingKeys[remainingIndex++];
                } else {
                    // No more keys to fill, leave as null or handle later?
                    // Actually we should filter out nulls if we don't want empty gaps at the end 
                    // but the grid expects a full page or at least contiguous items.
                    // However, the logic below handles "needed" keys for looping.
                    // Let's just break here, the array will have empty slots which we might need to clean up
                    // or fill with looped keys immediately.
                    break;
                }
            }
        }

        // If we have more remaining keys, they go to next pages
        const overflowKeys = remainingKeys.slice(remainingIndex);

        // Clean up newPage0 (remove nulls if any, though we usually fill it up)
        // But wait, if we have fewer keys than pageSize, we might have nulls at the end.
        // We should filter them out for now, and let the loop logic fill them.
        const cleanPage0 = newPage0.filter(k => k !== null);

        this.pages = [cleanPage0];

        // Handle overflow pages
        for (let i = 0; i < overflowKeys.length; i += pageSize) {
            this.pages.push(overflowKeys.slice(i, i + pageSize));
        }

        // Fill the last page (could be page 0) with looped keys if needed
        if (this.pages.length > 0) {
            const lastPage = this.pages[this.pages.length - 1];
            let needed = pageSize - lastPage.length;

            // We need a source of keys to loop from. 
            // The original implementation used 'keys' (all keys).
            // We should use the full list of newKeys for looping content.
            let sourceIndex = 0;
            while (needed > 0 && newKeys.length > 0) {
                // We want to add keys that are NOT already on this page if possible?
                // Or just loop through all keys? Standard behavior is loop through all.
                // But we must ensure we don't duplicate keys on the same page visually if we can avoid it?
                // The original logic just took keys[sourceIndex % keys.length].
                lastPage.push(newKeys[sourceIndex % newKeys.length]);
                sourceIndex++;
                needed--;
            }
        } else {
            this.pages.push([]);
        }

        if (this.scrollContainer) {
            this._isResetting = true;
            this.scrollContainer.scrollLeft = 0;
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
