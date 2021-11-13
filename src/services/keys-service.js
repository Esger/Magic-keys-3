import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';

@inject(EventAggregator)
export class KeysService {

    _keysKnowledge = [
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
            className: 'small'
        },
        {
            name: 'numeric',
            display: 'abc',
            className: 'small'
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
            name: 'quotes',
            display: '"',
            className: 'small hide8'
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
    ];

    _nonAlpha = [
        {
            name: 'dot',
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
            position: 'p9'
        },
    ]

    _numbers = [
        {
            name: '1',
            output: '1'
        },
        {
            name: '2',
            output: '2'
        },
        {
            name: '3',
            output: '3'
        },
        {
            name: '4',
            output: '4'
        },
        {
            name: '5',
            output: '5'
        },
        {
            name: '6',
            output: '6'
        },
        {
            name: '7',
            output: '7'
        },
        {
            name: '8',
            output: '8'
        },
        {
            name: '9',
            output: '9'
        },
        {
            name: '0',
            output: '0'
        },
    ]

    _keys = []; // simple copy of _knowledge to prevent passing lots of data around.
    _letters = [];
    _text = '';
    _tail = '';
    _tailLength = 4;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this._keysKnowledge.forEach(key => {
            if (key.output?.length) {
                this._keys.push({
                    name: key.name,
                    output: key.output
                });
                this._letters.push(key.name);
            }
        });
        this._loadKnowledge();
    }

    setAlphaKeyCount(count) {
        this._alphaKeyCount = count;
        this._eventAggregator.publish('boardType', count);
    }

    getAlphaKeyCount() {
        return this._alphaKeyCount;
    }

    setTailLength(value = 4) {
        this._tailLength = value;
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
        const cleanKnowledge = this._keysKnowledge.filter(key => key.name.length == 1 || key.name == 'new_word');
        cleanKnowledge.forEach(key => key.successors = []);
        this._keysKnowledge = cleanKnowledge;
        this._eventAggregator.publish('dataReady');
    }

    getKeys() {
        const useTail = this._tail.length && this._letters.indexOf(this._tail.substr(-1)) > -1;
        let nameStr = useTail ? this._tail.slice(-(this._tailLength - 1)) : 'new_word';
        let probableKeys = [];
        let knowledgeObj = undefined;
        while (nameStr.length > 0 && probableKeys.length < 26) {
            knowledgeObj = this._keysKnowledge.find(key => key.name == nameStr);
            const keys = knowledgeObj?.successors.map(char => this._keysKnowledge.find(key => key.name == char));
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
            this._keysKnowledge.filter(key => (key.name.length == 1) && (key.name != 'new_word')).forEach(key => {
                const keyIsUsedBefore = probableKeys?.some(k => k.name == key.name);
                if (!keyIsUsedBefore) {
                    completingKeys.push(key);
                }
            });
        };
        return JSON.parse(JSON.stringify([...probableKeys, ...completingKeys])) || [];
    }

    getNumbers() {
        return this._numbers;
    }

    getModifiers() {
        return [...this._modifiers, ...this._nonAlpha];
    }

    registerKeystroke(tail) {
        // For the typed key (last char of Tail) register preceding characters of Tail
        // TODO check better for more extended charactersets
        this._tail = tail;
        while (tail.length > 0) {
            const lessonChar = tail.substr(-1); // the key
            // possible tail patterns
            // 'ab' -> learn 'a' is followed by 'b'
            // 'a.' -> skip learning
            // '. ' -> skip learning
            // '  ' -> skip learning
            // ' a' -> skip learning
            // => all chars are part of _knowledge and and of type alpha
            const splitTail = tail.split('');
            const allAlpha = splitTail.every(key => this._letters.indexOf(key) > -1);
            if (allAlpha && tail.length > 1) {
                const learningString = tail.slice(0, -1);
                this._addToKnowledge(learningString, lessonChar);
            } else {
                // build successors for start new word
                (this._letters.indexOf(lessonChar) > -1) && this._addToKnowledge('new_word', lessonChar);
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
        this._keysKnowledge.push(newItem);
        return newItem;
    }

    _addToKnowledge(learningString, lessonChar) {
        const learningTailObj = this._keysKnowledge.find(key => key.name == learningString) ||
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
        // console.table([learningCharObj.name, ...learningCharObj.successors]);
    };

    _getText(lang = 'nl') {
        const httpClient = new HttpClient();
        httpClient.fetch('assets/lipsum-' + lang + '.txt')
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
            for (let startPos = 0; startPos < lastPosition; startPos++) {
                const tail = this._text.substring(startPos - this._tailLength, startPos);
                this.registerKeystroke(tail);
            }
            this._tail = '';
            this._eventAggregator.publish('dataReady');
            this._saveKnowledge();
        }
        console.table(this._keysKnowledge);
    }

    _loadKnowledge() {
        if (localStorage.getItem("magic-keys-3")) {
            this._keysKnowledge = JSON.parse(localStorage.getItem("magic-keys-3"));
        } else {
            this._getText();
        }
    }

    _saveWhenIdle() {
        clearTimeout(this._saveTimeoutId);
        this._saveTimeoutId = setTimeout(() => {
            this._saveKnowledge();
        }, 5000);
    }

    _saveKnowledge() {
        localStorage.setItem("magic-keys-3", JSON.stringify(this._keysKnowledge));
    }

}
