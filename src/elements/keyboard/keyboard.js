import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeysService } from "services/keys-service";

import { SettingsService } from "services/settings-service";

@inject(Element, EventAggregator, KeysService, SettingsService)
export class KeyboardCustomElement {
    @bindable isMobile;
    constructor(element, eventAggregator, keysService, settingsService) {
        this._element = element;
        this._eventAggregator = eventAggregator;
        this._keysService = keysService;
        this._settingsService = settingsService;
        this._maxKeys = this._settingsService.getSetting('boardType', 8);
        this.layoutMode = this._settingsService.getSetting('layout', 'smart');
        this._keysService.setAlphaKeyCount(this._maxKeys);
        this.keys = this._keysService.getKeys();
        this.caps = false;
        this._resetKeysetType();
        this._previousKeysetType = '';
        this.pages = [];
        this.currentPage = 0;
        this._isResetting = false;
        this._keyPositionHistory = new Map();
    }

    bind() {
        this._setBoardType(this._maxKeys);
        this.showScrollIndicator = this.isMobile;
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
        this.interpunction = this._keysService.getKeys('interpunction');
        this._trainingReadySubscriber = this._eventAggregator.subscribe('dataReady', _ => {
            this.keys = this._keysService.getKeys()
            this._updatePages();
        });
        this._boardTypeSubscriber = this._eventAggregator.subscribe('boardType', dynamicKeysAmount => this._setBoardType(dynamicKeysAmount));
        this._layoutModeSubscriber = this._eventAggregator.subscribe('layoutMode', mode => {
            this.layoutMode = mode;
            this._updatePages();
        });

        if (this.scrollContainer) {
            this.scrollContainer.addEventListener('scroll', this._onScroll.bind(this));
        }

        const updatePageHighlights = () => {
            const containerRect = this.scrollContainer.getBoundingClientRect();
            const threshold = 100;

            this.scrollContainer.querySelectorAll('.keys-page').forEach(page => {
                const rect = page.getBoundingClientRect();
                const outside = rect.right - threshold <= containerRect.left ||
                    rect.left + threshold >= containerRect.right;
                page.classList.toggle('highlight', outside);
            });
        };

        let rafId = null;
        this.scrollContainer.addEventListener('scroll', () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                this.showScrollIndicator = false;
                updatePageHighlights();
                rafId = null;
            });
        });

        // Initial check
        updatePageHighlights();
    }

    detached() {
        this._trainingReadySubscriber.dispose();
        this._boardTypeSubscriber.dispose();
        this._layoutModeSubscriber.dispose();

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
        const pageSize = this._maxKeys;
        const keys = this.keys;

        // 0. Update history with current page positions (before clearing)
        // Only learn from the clicked page as it's the one the user was focused on
        const page = this.pages[this.currentPage];
        if (page) {
            page.forEach((key, keyIndex) => {
                if (!this._keyPositionHistory.has(key.name)) {
                    this._keyPositionHistory.set(key.name, new Map());
                }
                const keyHistory = this._keyPositionHistory.get(key.name);
                const currentCount = keyHistory.get(keyIndex) || 0;
                keyHistory.set(keyIndex, currentCount + 1);
            });
        }

        // 1. Chunk the new predictions into pages
        const chunks = [];
        for (let i = 0; i < keys.length; i += pageSize) {
            chunks.push(keys.slice(i, i + pageSize));
        }

        // 1a. Fill the last page (loop around)
        const lastPage = chunks[chunks.length - 1];
        let needed = pageSize - lastPage.length;
        lastPage.push(...keys.slice(0, needed));

        // 2. Reorder keys in page 0 based on clicked page AND history
        const clickedPage = this.pages[this.currentPage] || [];
        const viewedPositions = new Map();
        clickedPage.forEach((k, i) => viewedPositions.set(k.name, i));

        const page0 = chunks[0];
        const stabilizedPage0 = new Array(pageSize).fill(null);
        const usedKeys = new Set();

        if (this.layoutMode === 'smart') {
            // Pass 1: Priority 1 - Clicked Page (Absolute Priority)
            for (const key of page0) {
                const clickedIndex = viewedPositions.get(key.name);
                if (clickedIndex !== undefined && clickedIndex < pageSize) {
                    stabilizedPage0[clickedIndex] = key;
                    usedKeys.add(key);
                }
            }

            // Pass 2: Priority 2 - History (Weighted Preference)
            for (const key of page0) {
                if (usedKeys.has(key)) continue; // Already placed

                const keyHistory = this._keyPositionHistory.get(key.name);
                if (keyHistory) {
                    // Find the index with the highest frequency
                    let bestIndex = -1;
                    let maxCount = -1;

                    for (const [index, count] of keyHistory.entries()) {
                        if (index < pageSize && count > maxCount) {
                            // Only consider if slot is empty
                            if (stabilizedPage0[index] === null) {
                                maxCount = count;
                                bestIndex = index;
                            }
                        }
                    }

                    if (bestIndex !== -1) {
                        stabilizedPage0[bestIndex] = key;
                        usedKeys.add(key);
                    }
                }
            }

            // Pass 3: Collect Remaining
            const remaining = [];
            for (const key of page0) {
                if (!usedKeys.has(key)) {
                    remaining.push(key);
                }
            }

            // Pass 4: Fill holes
            let rIndex = 0;
            for (let j = 0; j < pageSize; j++) {
                if (stabilizedPage0[j] === null && rIndex < remaining.length) {
                    stabilizedPage0[j] = remaining[rIndex++];
                }
            }

            // 3. Update chunks
            chunks[0] = stabilizedPage0;
        } else if (this.layoutMode === 'qwerty') {
            const qwertyOrder = 'qwertyuiopasdfghjklzxcvbnm'.split('');
            const sortFn = (a, b) => {
                const indexA = qwertyOrder.indexOf(a.name);
                const indexB = qwertyOrder.indexOf(b.name);
                // Handle keys not in qwertyOrder (if any) by putting them at the end
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            };
            chunks.forEach(chunk => chunk.sort(sortFn));
        }

        this.pages = chunks;

    }

    _resetScrollContainer() {
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
        if (!this._keysService.isValidBoardType(this.isMobile, amount)) {
            this._keysService.setAlphaKeyCount(8);
            amount = 8;
        }
        this._maxKeys = parseInt(amount, 10);
        const mobile = this.isMobile ? 'mobile--' : '';
        this.boardType = 'board--' + mobile + amount + 'keys';
        this.keyHitCount = 0;
        this.keyMissedCount = 0;
        this._keyPositionHistory.clear();
        this._resetKeysetType();
        this._updatePages();
    }

    _resetKeysetType() {
        const reset = this.keysetType !== 'numeric';
        if (!reset) return;

        this.keysetType = 'alpha';
    }

    _toggleKeysetType(type) {
        if (type === this.keysetType) {
            this.keysetType = 'alpha';
        } else {
            this._previousKeysetType = this.keysetType;
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

    keyIsPressed(key, event) {
        if (this._isSwiping) {
            this._isSwiping = false;
            return;
        }

        if (event && event.target)
            this._flash(event.target);

        this._eventAggregator.publish('keyIsPressed', key);
        this._handleKey(key, event.target)
    }

    _flash(keyElement) {
        keyElement.classList.add('flash');
        keyElement.addEventListener('animationend', _ => keyElement.classList.remove('flash'), { once: true });
    }

    swipeStart(event, key) {
        if (!this.isMobile) return true;
        this._startY = event.changedTouches[0].pageY;
        this._startX = event.changedTouches[0].pageX;
        this._isSwiping = false;

        if (event && event.target) {
            const keyElement = event.target;
            if (keyElement) {
                this._flash(keyElement);
            }
        }
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
                this._handleKey(upperKey, event.target);
            }
            // if (event.cancelable) event.preventDefault();
        } else if (Math.abs(diffY) < 10 && diffX < 10) {
            // It's a tap
            this._eventAggregator.publish('keyIsPressed', key);
            this._handleKey(key, event.target);
            if (event.cancelable) event.preventDefault();
        }
        this._flash(event.target);
        return true;
    }

    _handleKey(key, target = null) {
        this._lastKeyTyped = key;
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
            case ['brackets', 'numeric', 'symbols', 'interpunction'].includes(key.name):
                this._toggleKeysetType(key.name);
                break;
            default:
                this.caps = this._capsLock;
                const newKeys = this._keysService.getKeys(this.keysetType);
                const theKey = target || this._element.querySelector('.' + key.name)[0];
                theKey.addEventListener('animationend', _ => {
                    this.keys = newKeys;
                    if (this.keysetType == 'alpha') {
                        this._updatePages();
                        this._resetScrollContainer();
                    }
                    this._resetKeysetType();
                    key.output?.length && this.keyHitCount++;
                    this._eventAggregator.publish('keyHit', (this.keyHitCount));
                }, { once: true });
                break;
        }
    }
}
