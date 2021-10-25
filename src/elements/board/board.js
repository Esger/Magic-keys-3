export class BoardCustomElement {
  constructor() {
    this.keys = [
      {
        name: 'a'
      },
      {
        name: 'b'
      },
      {
        name: 'c'
      },
      {
        name: 'd'
      },
      {
        name: 'e'
      },
      {
        name: 'f'
      },
      {
        name: 'g'
      },
      {
        name: 'h'
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
        position: 'p6'
      },
      {
        name: 'comma',
        display: ',',
        position: 'p8'
      },
      {
        name: 'enter',
        display: '↵',
        position: 'p7'
      },
      {
        name: 'space',
        display: ' ',
        position: 'p9'
      },
    ]
  }
  getCss(key) {
    return 'template-area: ' + key.position;
  }
}
