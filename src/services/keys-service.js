import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';

import { SettingsService } from "services/settings-service";

@inject(EventAggregator, SettingsService)
export class KeysService {

    _defaultKeys = [
        {
            name: 'a',
            output: 'a',
            successors: [],
        },
        {
            name: 'b',
            output: 'b',
            successors: [],
        },
        {
            name: 'c',
            output: 'c',
            successors: [],
        },
        {
            name: 'd',
            output: 'd',
            successors: [],
        },
        {
            name: 'e',
            output: 'e',
            successors: [],
        },
        {
            name: 'f',
            output: 'f',
            successors: [],
        },
        {
            name: 'g',
            output: 'g',
            successors: [],
        },
        {
            name: 'h',
            output: 'h',
            successors: [],
        },
        {
            name: 'i',
            output: 'i',
            successors: [],
        },
        {
            name: 'j',
            output: 'j',
            successors: [],
        },
        {
            name: 'k',
            output: 'k',
            successors: [],
        },
        {
            name: 'l',
            output: 'l',
            successors: [],
        },
        {
            name: 'm',
            output: 'm',
            successors: [],
        },
        {
            name: 'n',
            output: 'n',
            successors: [],
        },
        {
            name: 'o',
            output: 'o',
            successors: [],
        },
        {
            name: 'p',
            output: 'p',
            successors: [],
        },
        {
            name: 'q',
            output: 'q',
            successors: [],
        },
        {
            name: 'r',
            output: 'r',
            successors: [],
        },
        {
            name: 's',
            output: 's',
            successors: [],
        },
        {
            name: 't',
            output: 't',
            successors: [],
        },
        {
            name: 'u',
            output: 'u',
            successors: [],
        },
        {
            name: 'v',
            output: 'v',
            successors: [],
        },
        {
            name: 'w',
            output: 'w',
            successors: [],
        },
        {
            name: 'x',
            output: 'x',
            successors: [],
        },
        {
            name: 'y',
            output: 'y',
            successors: [],
        },
        {
            name: 'z',
            output: 'z',
            successors: [],
        },
        {
            name: 'new_word',
            successors: [],
        },
    ];

    _modifiers = [
        {
            name: 'shift',
            display: '⇧',
            title: 'Double click for Caps-lock'
        },
        {
            name: 'numeric',
            display: '123',
            className: 'numeric small'
        },
        {
            name: 'symbols',
            display: '@',
            className: 'small'
        },
        {
            name: 'brackets',
            display: '()',
            className: 'small'
        },
        {
            name: 'interpunction',
            display: '"',
            className: 'small interpunction'
        },
    ];

    _nonAlpha = [
        {
            name: 'period',
            display: '.',
            output: '.',
            className: 'small'
        },
        {
            name: 'enter',
            display: '↵',
            output: '\n',
            className: 'small'
        },
        {
            name: 'comma',
            display: ',',
            output: ',',
            className: 'small'
        },
        {
            name: 'space',
            display: ' ',
            output: ' ',
        },
        {
            name: 'plus',
            display: '+',
            output: '+',
            className: 'plus'
        },
        {
            name: 'minus',
            display: '-',
            output: '-',
        },
        {
            name: 'asterisk',
            display: '*',
            output: '*',
        },
        {
            name: 'backspace',
            display: '⇦',
        },
        {
            name: 'next',
            display: '⇨',
            className: 'highlight',
            title: 'More keys…'
        },
    ]

    _numbers = [
        {
            name: 'one',
            display: '1',
            output: '1'
        },
        {
            name: 'two',
            display: '2',
            output: '2'
        },
        {
            name: 'three',
            display: '3',
            output: '3'
        },
        {
            name: 'four',
            display: '4',
            output: '4'
        },
        {
            name: 'five',
            display: '5',
            output: '5',
            className: 'five'
        },
        {
            name: 'six',
            display: '6',
            output: '6'
        },
        {
            name: 'seven',
            display: '7',
            output: '7'
        },
        {
            name: 'eight',
            display: '8',
            output: '8'
        },
        {
            name: 'nine',
            display: '9',
            output: '9'
        },
        {
            name: 'zero',
            display: '0',
            output: '0',
            className: 'zero'
        },
    ]

    _interpunction = [
        {
            name: 'backtick',
            display: '\`',
            output: '\''
        },
        {
            name: 'doublequote',
            display: '\"',
            output: '\"'
        },
        {
            name: 'singlequote',
            display: '\'',
            output: '\''
        },
        {
            name: 'paragraph',
            display: '§',
            output: '§'
        },
        {
            name: 'colon',
            display: ':',
            output: ':'
        },
        {
            name: 'semicolon',
            display: ';',
            output: ';'
        },
        {
            name: 'exclamation',
            display: '!',
            output: '!'
        },
        {
            name: 'underscore',
            display: '_',
            output: '_'
        },
        {
            name: 'questionmark',
            display: '?',
            output: '?'
        },
    ]

    _brackets = [
        {
            name: 'parenthesisopen',
            output: '(',
            display: '(',
            className: 'small',
        },
        {
            name: 'parenthesisclose',
            output: ')',
            display: ')',
            className: 'small'
        },
        {
            name: 'bracketopen',
            output: '[',
            display: '[',
            className: 'small'
        },
        {
            name: 'bracketclose',
            output: ']',
            display: ']',
            className: 'small'
        },
        {
            name: 'curlybracesopen',
            output: '{',
            display: '{',
            className: 'small'
        },
        {
            name: 'curlybracesclose',
            output: '}',
            display: '}',
            className: 'small'
        },
        {
            name: 'lessthan',
            output: '<',
            display: '<',
            className: 'small'
        },
        {
            name: 'greaterthan',
            output: '>',
            display: '>',
            className: 'small'
        },
        {
            name: 'pipe',
            output: '|',
            display: '|',
            className: 'pipe small'
        },
        {
            name: 'slash',
            output: '/',
            display: '/',
            className: 'small'
        },
        {
            name: 'backslash',
            output: '\\',
            display: '\\',
            className: 'small'
        },
    ]

    _symbols = [
        {
            name: 'plusminus',
            display: '±',
            output: '±',
        },
        {
            name: 'at',
            display: '@',
            output: '@',
        },
        {
            name: 'hash',
            display: '#',
            output: '#',
        },
        {
            name: 'dollar',
            display: '$',
            output: '$',
        },
        {
            name: 'percent',
            display: '%',
            output: '%',
        },
        {
            name: 'caret',
            display: '^',
            output: '^',
        },
        {
            name: 'ampersand',
            display: '&',
            output: '&',
        },
        {
            name: 'tilde',
            display: '~',
            output: '~',
        },
        {
            name: 'equals',
            display: '=',
            output: '=',
        },
    ]

    _keysKnowledge = {};
    _keys = []; // simple copy of _knowledge to prevent passing lots of data around.
    _letters = [];
    _text = '';
    _tail = '';
    _tailLength = 4;

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this._defaultKeys.forEach(key => {
            // Populate the object structure
            this._keysKnowledge[key.name] = { ...key };

            if (key.output?.length) {
                this._keys.push({
                    name: key.name,
                    output: key.output
                });
                this._letters.push(key.name);
            }
        });
        this._loadKnowledge();

        // Load settings
        this._alphaKeyCount = this._settingsService.getSetting('boardType', 8);
        this._tailLength = this._settingsService.getSetting('depth', 4);
    }

    setAlphaKeyCount(count) {
        this._alphaKeyCount = count;
        this._settingsService.setSetting('boardType', count);
        this._eventAggregator.publish('boardType', count);
    }

    getAlphaKeyCount() {
        return this._alphaKeyCount;
    }

    setTailLength(value = 4) {
        this._tailLength = value;
        this._settingsService.setSetting('depth', value);
        this.resetData();
    }

    getTailLength() {
        return this._tailLength;
    }

    resetData() {
        this._tailLength = 4;
        this.cleanData();
        this._getText();
    }

    cleanData() {
        const cleanKnowledge = {};
        Object.values(this._keysKnowledge).forEach(key => {
            if (key.name.length == 1 || key.name == 'new_word') {
                key.successors = [];
                cleanKnowledge[key.name] = key;
            }
        });
        this._keysKnowledge = cleanKnowledge;
        this._eventAggregator.publish('dataReady');
    }

    _getKeys() {
        const useTail = this._tail.length && this._letters.includes(this._tail.slice(-1));
        let nameStr = useTail ? this._tail.slice(-(this._tailLength - 1)) : 'new_word';
        let probableKeys = [];
        let knowledgeObj = undefined;
        while (nameStr.length > 0 && probableKeys.length < 26) {
            knowledgeObj = this._keysKnowledge[nameStr]; // Object lookup
            const keys = knowledgeObj?.successors.map(char => this._keysKnowledge[char]); // Object lookup
            keys?.forEach(key => {
                const keyIsUsedBefore = probableKeys?.some(k => k.name == key.name);
                if (!keyIsUsedBefore) {
                    probableKeys.push(key);
                }
            });
            nameStr = (nameStr == 'new_word') ? '' : nameStr.slice(1);
        }

        let completingKeys = [];
        if (probableKeys.length < 26) {
            Object.values(this._keysKnowledge).filter(key => (key.name.length == 1) && (key.name != 'new_word')).forEach(key => { // Iterate over values
                const keyIsUsedBefore = probableKeys?.some(k => k.name == key.name);
                if (!keyIsUsedBefore) {
                    completingKeys.push(key);
                }
            });
        };
        return structuredClone([...probableKeys, ...completingKeys]) || [];
    }

    getKeys(setName) {
        let keys;
        switch (setName) {
            case 'interpunction':
                keys = this._interpunction;
                break;
            case 'numbers':
                keys = this._numbers;
                break;
            case 'symbols':
                keys = this._symbols;
                break;
            case 'brackets':
                keys = this._brackets;
                break;
            case 'modifiers':
                keys = this._modifiers;
                break;
            case 'nonAlpha':
                keys = this._nonAlpha;
                break;
            default:
                keys = this._getKeys();
                break;
        }
        return keys;
    }

    setTail(tail) {
        this._tail = tail;
        this._eventAggregator.publish('dataReady');
    }

    registerKeystroke(tail) {
        tail = tail.toLowerCase();
        // For the typed key (last char of Tail) register preceding characters of Tail
        // TODO check better for more extended charactersets
        this._tail = tail;
        while (tail.length > 0) {
            const lessonChar = tail.slice(-1); // the key
            // possible tail patterns
            // 'ab' -> learn 'a' is followed by 'b'
            // 'a.' -> skip learning
            // '. ' -> skip learning
            // '  ' -> skip learning
            // ' a' -> skip learning
            // => all chars are part of _knowledge and and of type alpha
            const allAlpha = /^[a-z]+$/.test(tail);
            if (allAlpha && tail.length > 1) {
                const learningString = tail.slice(0, -1);
                this._addToKnowledge(learningString, lessonChar);
            } else {
                // build successors for start new word
                this._letters.includes(lessonChar) && this._addToKnowledge('new_word', lessonChar);
            }
            tail = tail.slice(1);
            this._saveWhenIdle();
        }
    }

    _newKeyKnowledgeItem(name) {
        const newItem = {
            name: name,
            successors: [],
        };
        this._keysKnowledge[name] = newItem;
        return newItem;
    }

    _addToKnowledge(learningString, lessonChar) {
        const learningTailObj = this._keysKnowledge[learningString] ||
            this._newKeyKnowledgeItem(learningString);
        const successors = learningTailObj.successors;
        const successorPos = successors.indexOf(lessonChar);
        if (successorPos > -1) {
            if (successorPos > 0) {
                // shift current one position down
                const temp = successors[successorPos - 1];
                successors[successorPos - 1] = lessonChar;
                successors[successorPos] = temp;
            }
        } else {
            learningTailObj.successors.push(lessonChar);
        }
        // console.table([learningString, successors]);
        // console.table(this._keysKnowledge);
    };

    _getText(lang = 'nl') {
        const httpClient = new HttpClient();
        // httpClient.fetch('assets/aap-' + lang + '.txt')
        // httpClient.fetch('assets/lipsum-' + lang + '.txt')
        httpClient.fetch('assets/De-Geschiedenis-van-Woutertje-Pieterse-Multatuli.txt')
            .then(response => {
                return response.text();
            }).then(data => {
                this._text = data;
                this._train();
            });
    }

    _train() {
        const lastPosition = this._text.length;
        if (lastPosition > 0) {
            let startPos = 0;
            const chunkSize = 2000;

            const processChunk = () => {
                const endPos = Math.min(startPos + chunkSize, lastPosition);

                for (; startPos < endPos; startPos++) {
                    const tail = this._text.substring(startPos - this._tailLength, startPos);
                    this.registerKeystroke(tail);
                }

                if (startPos < lastPosition) {
                    setTimeout(processChunk, 0);
                } else {
                    this._tail = '';
                    this._eventAggregator.publish('dataReady');
                    this._saveKnowledge();
                }
            };

            processChunk();
        }
    }

    _loadKnowledge() {
        const data = this._settingsService.loadKnowledge();
        if (data) {
            if (Array.isArray(data)) {
                // Migrate old array data to object
                this._keysKnowledge = {};
                data.forEach(item => {
                    this._keysKnowledge[item.name] = item;
                });
            } else {
                this._keysKnowledge = data;
            }
        } else {
            this._getText();
        }
    }

    _saveWhenIdle() {
        clearTimeout(this._saveTimeoutId);
        this._saveTimeoutId = setTimeout(_ => this._saveKnowledge(), 10000);
    }

    _saveKnowledge() {
        this._settingsService.saveKnowledge(this._keysKnowledge);
    }

}
