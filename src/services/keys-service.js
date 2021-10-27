export class KeysService {

  _keysKnowledge = [
    {
      name: 'a',
      output: 'a',
      predecessors: [],
    },
    {
      name: 'b',
      output: 'b',
      predecessors: [],
    },
    {
      name: 'c',
      output: 'c',
      predecessors: [],
    },
    {
      name: 'd',
      output: 'd',
      predecessors: [],
    },
    {
      name: 'e',
      output: 'e',
      predecessors: [],
    },
    {
      name: 'f',
      output: 'f',
      predecessors: [],
    },
    {
      name: 'g',
      output: 'g',
      predecessors: [],
    },
    {
      name: 'h',
      output: 'h',
      predecessors: [],
    },
    {
      name: 'i',
      output: 'i',
      predecessors: [],
    },
    {
      name: 'j',
      output: 'j',
      predecessors: [],
    },
    {
      name: 'k',
      output: 'k',
      predecessors: [],
    },
    {
      name: 'l',
      output: 'l',
      predecessors: [],
    },
    {
      name: 'm',
      output: 'm',
      predecessors: [],
    },
    {
      name: 'n',
      output: 'n',
      predecessors: [],
    },
    {
      name: 'o',
      output: 'o',
      predecessors: [],
    },
    {
      name: 'p',
      output: 'p',
      predecessors: [],
    },
    {
      name: 'q',
      output: 'q',
      predecessors: [],
    },
    {
      name: 'r',
      output: 'r',
      predecessors: [],
    },
    {
      name: 's',
      output: 's',
      predecessors: [],
    },
    {
      name: 't',
      output: 't',
      predecessors: [],
    },
    {
      name: 'u',
      output: 'u',
      predecessors: [],
    },
    {
      name: 'v',
      output: 'v',
      predecessors: [],
    },
    {
      name: 'w',
      output: 'w',
      predecessors: [],
    },
    {
      name: 'x',
      output: 'x',
      predecessors: [],
    },
    {
      name: 'y',
      output: 'y',
      predecessors: [],
    },
    {
      name: 'z',
      output: 'z',
      predecessors: [],
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
  _keys = [];

  constructor() {
    this._keysKnowledge.forEach(key => {
      this._keys.push({
        name: key.name,
        output: key.output
      });
    });
  }

  getKeys() {
    return this._keys;
  }

  getModifiers() {
    return this._modifiers;
  }

  registerKeystroke(tail) {
    const chars = tail.split('');
    // console.table(chars);
  }

}
