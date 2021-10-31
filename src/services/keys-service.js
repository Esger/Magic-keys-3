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
      count: 0,
    },
    {
      name: 'b',
      output: 'b',
      successors: [],
      count: 0,
    },
    {
      name: 'c',
      output: 'c',
      successors: [],
      count: 0,
    },
    {
      name: 'd',
      output: 'd',
      successors: [],
      count: 0,
    },
    {
      name: 'e',
      output: 'e',
      successors: [],
      count: 0,
    },
    {
      name: 'f',
      output: 'f',
      successors: [],
      count: 0,
    },
    {
      name: 'g',
      output: 'g',
      successors: [],
      count: 0,
    },
    {
      name: 'h',
      output: 'h',
      successors: [],
      count: 0,
    },
    {
      name: 'i',
      output: 'i',
      successors: [],
      count: 0,
    },
    {
      name: 'j',
      output: 'j',
      successors: [],
      count: 0,
    },
    {
      name: 'k',
      output: 'k',
      successors: [],
      count: 0,
    },
    {
      name: 'l',
      output: 'l',
      successors: [],
      count: 0,
    },
    {
      name: 'm',
      output: 'm',
      successors: [],
      count: 0,
    },
    {
      name: 'n',
      output: 'n',
      successors: [],
      count: 0,
    },
    {
      name: 'o',
      output: 'o',
      successors: [],
      count: 0,
    },
    {
      name: 'p',
      output: 'p',
      successors: [],
      count: 0,
    },
    {
      name: 'q',
      output: 'q',
      successors: [],
      count: 0,
    },
    {
      name: 'r',
      output: 'r',
      successors: [],
      count: 0,
    },
    {
      name: 's',
      output: 's',
      successors: [],
      count: 0,
    },
    {
      name: 't',
      output: 't',
      successors: [],
      count: 0,
    },
    {
      name: 'u',
      output: 'u',
      successors: [],
      count: 0,
    },
    {
      name: 'v',
      output: 'v',
      successors: [],
      count: 0,
    },
    {
      name: 'w',
      output: 'w',
      successors: [],
      count: 0,
    },
    {
      name: 'x',
      output: 'x',
      successors: [],
      count: 0,
    },
    {
      name: 'y',
      output: 'y',
      successors: [],
      count: 0,
    },
    {
      name: 'z',
      output: 'z',
      successors: [],
      count: 0,
    },
  ];

  _modifiers = [
    {
      name: 'shift',
      display: '⇧',
      position: 'p0'
    },
    {
      name: 'numeric',
      display: '123',
      position: 'p1',
      className: 'small'
    },
    {
      name: 'symbols',
      position: 'p2',
      display: '@',
      className: 'small'
    },
    {
      name: 'brackets',
      display: '()',
      position: 'p3',
      className: 'small'
    },
    {
      name: 'backspace',
      display: '⇦',
      position: 'p4'
    },
    {
      name: 'next',
      display: '⇨',
      position: 'p5'
    },
  ];

  _nonAlpha = [
    {
      name: 'dot',
      display: '.',
      output: '.',
      position: 'p6'
    },
    {
      name: 'enter',
      display: '↵',
      output: '\n',
      position: 'p7'
    },
    {
      name: 'comma',
      display: ',',
      output: ',',
      position: 'p8'
    },
    {
      name: 'space',
      display: ' ',
      output: ' ',
      position: 'p9'
    },
  ]

  _keys = []; // simple copy of _knowledge to prevent passing lots of data around.
  _letters = [];
  _wordKnowledge = {
    name: 'new_word',
    successors: [],
    count: 0,
  };
  _text = '';
  _tailLength = 2;

  constructor(eventAggregator) {
    this._eventAggregator = eventAggregator;
    this._keysKnowledge.forEach(key => {
      this._keys.push({
        name: key.name,
        output: key.output
      });
      this._letters.push(key.name);
    });
    this._getText();
  }

  getTailLength() {
    return this._tailLength;
  }

  getKeys(char) {
    const targetKey = this._keysKnowledge.find(key => key.name == char) || this._wordKnowledge;
    const predictedKeys = [];
    const completingKeys = [];

    targetKey.successors.forEach(char => {
      predictedKeys.push(this._keysKnowledge.find(key => key.name == char));
    });

    this._keysKnowledge.forEach(key => {
      const keyIsUsedBefore = targetKey.successors.includes(key.name);
      !keyIsUsedBefore && completingKeys.push(key);
    });

    return [...predictedKeys, ...completingKeys];
  }

  getModifiers() {
    return [...this._modifiers, ...this._nonAlpha];
  }

  registerKeystroke(tail) {
    // TODO check better for more extended charactersets
    if (tail.length > 0) {
      const splitTail = tail.split('');
      const lessonChar = splitTail[splitTail.length - 1];
      // possible tail patterns
      // 'ab' -> learn 'a' is followed by 'b'
      // 'a.' -> skip learning
      // '. ' -> skip learning
      // '  ' -> skip learning
      // ' a' -> skip learning
      // => all chars are part of _knowledge and and of type alpha
      const allAlpha = splitTail.every(key => this._letters.indexOf(key) > -1);
      if (allAlpha && tail.length > 1) {
        const learningCharObj = this._keysKnowledge.find(key => key.name == splitTail[0]);
        this._learnLetter(learningCharObj, lessonChar);
      } else {
        // build successors for start new word
        (this._letters.indexOf(lessonChar) > -1) && this._learnLetter(this._wordKnowledge, lessonChar);
      }
    }
  }

  _learnLetter(learningCharObj, lessonChar) {
    const successors = learningCharObj.successors;
    const successorPos = successors.indexOf(lessonChar);
    if (successorPos > -1) {
      if (successorPos > 0) {
        // shift current one position down
        const temp = successors[successorPos - 1];
        successors[successorPos - 1] = lessonChar;
        successors[successorPos] = temp;
      }
    } else {
      learningCharObj.successors.push(lessonChar);
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
    const lastPosition = this._text.length - this._tailLength;
    if (lastPosition > 0) {
      for (let startPos = 0; startPos < lastPosition; startPos++) {
        const tail = this._text.substring(startPos - this._tailLength, startPos);
        this.registerKeystroke(tail);
      }
      this._eventAggregator.publish('trainingReady');
    }
    // console.log(this._text);
  }

}
