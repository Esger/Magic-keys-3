export class BoardCustomElement {
  constructor() {
    this.maxKeys = 8;
    this.keys = [
      {
        name: 'a',
        output: 'a'
      },
      {
        name: 'b',
        output: 'b'
      },
      {
        name: 'c',
        output: 'c'
      },
      {
        name: 'd',
        output: 'd'
      },
      {
        name: 'e',
        output: 'e'
      },
      {
        name: 'f',
        output: 'f'
      },
      {
        name: 'g',
        output: 'g'
      },
      {
        name: 'h',
        output: 'h'
      },
      {
        name: 'i',
        output: 'j'
      },
      {
        name: 'k',
        output: 'k'
      },
      {
        name: 'l',
        output: 'l'
      },
      {
        name: 'm',
        output: 'm'
      },
      {
        name: 'n',
        output: 'n'
      },
      {
        name: 'o',
        output: 'o'
      },
      {
        name: 'p',
        output: 'p'
      },
      {
        name: 'q',
        output: 'q'
      },
      {
        name: 'r',
        output: 'r'
      },
      {
        name: 's',
        output: 's'
      },
      {
        name: 't',
        output: 't'
      },
      {
        name: 'u',
        output: 'u'
      },
      {
        name: 'v',
        output: 'v'
      },
      {
        name: 'v',
        output: 'v'
      },
      {
        name: 'w',
        output: 'w'
      },
      {
        name: 'x',
        output: 'x'
      },
      {
        name: 'y',
        output: 'y'
      },
      {
        name: 'z',
        output: 'z'
      },
    ];
    this.modifiers = [
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
  }
}
