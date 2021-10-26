export class BoardCustomElement {
  constructor() {
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
      },
      {
        name: 'brackets',
        display: '()',
        position: 'p3'
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

  getCss(key) {
    return 'template-area: ' + key.position + ';';
  }

}
