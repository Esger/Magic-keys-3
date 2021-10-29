import { inject } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator'; // kan weg?
import { HttpClient } from 'aurelia-fetch-client';

@inject(EventAggregator)
export class KeysService {

  _keysKnowledge = [
    {
      name: 'a',
      type: 'alpha',
      output: 'a',
      successors: [],
    },
    {
      name: 'b',
      type: 'alpha',
      output: 'b',
      successors: [],
    },
    {
      name: 'c',
      type: 'alpha',
      output: 'c',
      successors: [],
    },
    {
      name: 'd',
      type: 'alpha',
      output: 'd',
      successors: [],
    },
    {
      name: 'e',
      type: 'alpha',
      output: 'e',
      successors: [],
    },
    {
      name: 'f',
      type: 'alpha',
      output: 'f',
      successors: [],
    },
    {
      name: 'g',
      type: 'alpha',
      output: 'g',
      successors: [],
    },
    {
      name: 'h',
      type: 'alpha',
      output: 'h',
      successors: [],
    },
    {
      name: 'i',
      type: 'alpha',
      output: 'i',
      successors: [],
    },
    {
      name: 'j',
      type: 'alpha',
      output: 'j',
      successors: [],
    },
    {
      name: 'k',
      type: 'alpha',
      output: 'k',
      successors: [],
    },
    {
      name: 'l',
      type: 'alpha',
      output: 'l',
      successors: [],
    },
    {
      name: 'm',
      type: 'alpha',
      output: 'm',
      successors: [],
    },
    {
      name: 'n',
      type: 'alpha',
      output: 'n',
      successors: [],
    },
    {
      name: 'o',
      type: 'alpha',
      output: 'o',
      successors: [],
    },
    {
      name: 'p',
      type: 'alpha',
      output: 'p',
      successors: [],
    },
    {
      name: 'q',
      type: 'alpha',
      output: 'q',
      successors: [],
    },
    {
      name: 'r',
      type: 'alpha',
      output: 'r',
      successors: [],
    },
    {
      name: 's',
      type: 'alpha',
      output: 's',
      successors: [],
    },
    {
      name: 't',
      type: 'alpha',
      output: 't',
      successors: [],
    },
    {
      name: 'u',
      type: 'alpha',
      output: 'u',
      successors: [],
    },
    {
      name: 'v',
      type: 'alpha',
      output: 'v',
      successors: [],
    },
    {
      name: 'w',
      type: 'alpha',
      output: 'w',
      successors: [],
    },
    {
      name: 'x',
      type: 'alpha',
      output: 'x',
      successors: [],
    },
    {
      name: 'y',
      type: 'alpha',
      output: 'y',
      successors: [],
    },
    {
      name: 'z',
      type: 'alpha',
      output: 'z',
      successors: [],
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
      type: 'nonAlpha',
      display: '.',
      output: '.',
      position: 'p6'
    },
    {
      name: 'enter',
      type: 'nonAlpha',
      display: '↵',
      output: '\n',
      position: 'p7'
    },
    {
      name: 'comma',
      type: 'nonAlpha',
      display: ',',
      output: ',',
      position: 'p8'
    },
    {
      name: 'space',
      type: 'nonAlpha',
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
  };
  _text = '';
  _tailLength = 2;

  constructor(eventAggregator) {
    this._eventAggregator = eventAggregator;
    this._keysKnowledge.forEach(key => {
      this._keys.push({
        name: key.name,
        type: 'alpha', // kan weg??
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
    // predictedKeys = targetKey.successors.map(this._keysKnowledge.find(key => key.name == char));
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
