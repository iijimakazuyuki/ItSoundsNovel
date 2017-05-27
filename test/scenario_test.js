const assert = require('chai').assert;
const Scenario = require('../src/scenario.js');
const sinon = require('sinon');

const Character = require('../src/character.js');
const Image = require('../src/image.js');
const Flag = require('../src/flag.js');
const MessageConfig = require('../src/config/message_config.js');
const AreaConfig = require('../src/config/area_config.js');
const BackgroundConfig = require('../src/config/background_config.js');
const ButtonConfig = require('../src/config/button_config.js');
const DisplayConfig = require('../src/config/display_config.js');
const MessageBackgroundConfig
    = require('../src/config/message_background_config.js');
const OverlayConfig = require('../src/config/overlay_config.js');
const StatusConfig = require('../src/config/status_config.js');
const UIConfig = require('../src/config/ui_config.js');

const normalCharacterOf = v => new Character(null, null, v);

const normalCharacterArrayOf = a => a.map(v => normalCharacterOf(v));

const keyValueControlCharacterOf = (k, v) => new Character('keyValue', k, v);

const hyperlinkControlCharacterOf = (k, v) => new Character('hyperlink', k, v);

const sleepControlCharacterOf = v => new Character('sleep', 'sleep', v);

const rubyControlCharacterOf = (k, v) => new Character('ruby', k, v);

const mockOfLetterElement = () => ({
    css: sinon.stub().returnsThis(),
    delay: sinon.stub().returnsThis(),
    queue: sinon.stub().returnsThis(),
    one: sinon.stub().returnsThis(),
});

const mockOfMessageWindowToDisplay = () => ({
    append: sinon.stub().returnsThis(),
    text: sinon.stub().returnsThis(),
});

const mockOfStatusWindowToDisplay = () => ({
    append: sinon.stub().returnsThis(),
});

const mockOfButton = () => ({
    off: sinon.stub().returnsThis(),
    show: sinon.stub().returnsThis(),
    click: sinon.stub().returnsThis(),
});

const mockOfBackgroundElement = () => ({
    append: sinon.spy(),
    css: sinon.spy(),
});

const mockOfBackgroundImageElement = () => ({
    css: sinon.stub().returnsThis(),
    on: sinon.stub().returnsThis(),
    delay: sinon.stub().returnsThis(),
    queue: sinon.stub().returnsThis(),
    one: sinon.stub().returnsThis(),
});

const mockOfOverlayElement = () => ({
    css: sinon.stub().returnsThis(),
    on: sinon.stub().returnsThis(),
    delay: sinon.stub().returnsThis(),
    queue: sinon.stub().returnsThis(),
    one: sinon.stub().returnsThis(),
});

const mockOfBackgroundColorElement = () => ({
    css: sinon.stub().returnsThis(),
    on: sinon.stub().returnsThis(),
    delay: sinon.stub().returnsThis(),
    queue: sinon.stub().returnsThis(),
    one: sinon.stub().returnsThis(),
});

const mockOfMessageWindowToChangeStyle = () => ({
    css: sinon.stub().returnsThis(),
    one: sinon.stub().returnsThis(),
});

const mockOfImageElement = () => ({
    css: sinon.stub().returnsThis(),
    on: sinon.stub().returnsThis(),
    delay: sinon.stub().returnsThis(),
    queue: sinon.stub().returnsThis(),
    one: sinon.stub().returnsThis(),
    remove: sinon.stub().returnsThis(),
});

const mockOfAudio = () => ({
    append: sinon.stub().returnsThis(),
    on: sinon.stub().returnsThis(),
    remove: sinon.stub().returnsThis(),
    length: 1,
    0: {
        play: sinon.spy(),
        pause: sinon.spy(),
    },
});

const mockOfFlagElement = () => ({
    text: sinon.spy(),
    length: 1,
    detach: sinon.stub().returnsThis(),
    appendTo: sinon.stub().returnsThis(),
});

const stubOfStatusWindowElement = () => ({
    attr: sinon.stub().returns('statusWindow'),
});

describe('Scenario', function () {
    let scenario;

    beforeEach(function () {
        scenario = new Scenario();
        scenario.$ = sinon.stub();
        scenario.$ = scenario.$.returns(scenario.$);
        scenario.$.delay = sinon.stub().returnsThis();
        scenario.$.append = sinon.stub().returnsThis();
        scenario.$.click = sinon.stub().returnsThis();
        scenario.$.css = sinon.stub().returnsThis();
        scenario.$.queue = sinon.stub().returnsThis();
        scenario.$.remove = sinon.stub().returnsThis();
        scenario.$.off = sinon.stub().returnsThis();
        scenario.$.text = sinon.stub().returnsThis();
        scenario.$.get = sinon.stub().returnsThis();
        scenario.$.removeClass = sinon.stub().returnsThis();
        scenario.$.one = sinon.stub().returnsThis();
        scenario.$.show = sinon.stub().returnsThis();
    });

    describe('#load()', function () {
        it('should get content with $ as yaml and start a scenario automatically', function () { // eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- abc',
                    '- def',
                    '- ghi',
                ].join('\n')
            );
            let url = '';
            let aStub = mockOfLetterElement();
            let bStub = mockOfLetterElement();
            let cStub = mockOfLetterElement();
            scenario.$.withArgs('<span>a</span>').returns(aStub);
            scenario.$.withArgs('<span>b</span>').returns(bStub);
            scenario.$.withArgs('<span>c</span>').returns(cStub);
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock)

            // act
            scenario.load(url);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['a', 'b', 'c']),
                        }
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(['d', 'e', 'f']),
                        }
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(['g', 'h', 'i']),
                        }
                    },
                ]
            );
            assert(displayMock.append.withArgs(aStub).called);
            assert(displayMock.append.withArgs(bStub).called);
            assert(displayMock.append.withArgs(cStub).called);
        });
        it('should set message objects', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- message: abc',
                    '- message: jkl',
                    '- message: 123',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['a', 'b', 'c']),
                        }
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(['j', 'k', 'l']),
                        }
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(['1', '2', '3']),
                        }
                    },
                ]
            );
        });
        it('should set message objects with newlines', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- |-',
                    '  abc',
                    '  def',
                    '  ghi',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf([
                                'a', 'b', 'c', '\n',
                                'd', 'e', 'f', '\n',
                                'g', 'h', 'i'
                            ]),
                        }
                    },
                ]
            );
        });
        it('should set message objects with a number', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- 1',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['1']),
                        }
                    },
                ]
            );
        });
        it('should set message objects with wait', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- message: mno',
                    '  next: wait',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['m', 'n', 'o']),
                        },
                        next: 'wait',
                    },
                ]
            );
        });
        it('should set message objects with auto', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- message: mno',
                    '  auto: 100',
                    '- message: abc',
                    '  auto: 0',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['m', 'n', 'o']),
                        },
                        auto: 100,
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(['a', 'b', 'c']),
                        },
                        auto: 0,
                    },
                ]
            );
        });
        it('should set message objects with no flush', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- message: abc',
                    '  flush: none',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['a', 'b', 'c']),
                        },
                        flush: 'none',
                    },
                ]
            );
        });
        it('should set message objects with no flush', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- message: abc',
                    '  flush: none',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['a', 'b', 'c']),
                        },
                        flush: 'none',
                    },
                ]
            );
        });
        it('should set a display configuration for messages', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- config:',
                    '    message:',
                    '      delay: 10',
                    '      duration: 100',
                    '      timingFunction: ease',
                    '- config:',
                    '    message:',
                    '      delay: 10',
                    '      duration: 100',
                    '      timingFunction: ease-in-out',
                    '      background:',
                    '        color: black',
                    '        duration: 500',
                    '        timingFunction: ease-in',
                    '      position:',
                    '        x: 10',
                    '        y: 10%',
                    '        width: 100%',
                    '        height: 50px',
                    '        scaleX: 0.5',
                    '        scaleY: 0.5',
                    '        rotateX: 10deg',
                    '        rotateY: 20deg',
                    '        rotateZ: 30deg',
                    '        duration: 500',
                    '        timingFunction: ease-out',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        config: new DisplayConfig({
                            message: {
                                delay: 10,
                                duration: 100,
                                timingFunction: 'ease',
                            },
                        }),
                    },
                    {
                        config: new DisplayConfig({
                            message: {
                                delay: 10,
                                duration: 100,
                                timingFunction: 'ease-in-out',
                                background: {
                                    color: 'black',
                                    duration: 500,
                                    timingFunction: 'ease-in',
                                },
                                position: {
                                    x: '10px',
                                    y: '10%',
                                    width: '100%',
                                    height: '50px',
                                    scaleX: 0.5,
                                    scaleY: 0.5,
                                    rotateX: '10deg',
                                    rotateY: '20deg',
                                    rotateZ: '30deg',
                                    duration: 500,
                                    timingFunction: 'ease-out',
                                },
                            },
                        }),
                    },
                ]
            );
        });
        it('should set message and a display configuration', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- message: mno',
                    '  config:',
                    '    delay: 10',
                    '    duration: 100',
                    '    timingFunction: ease',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: normalCharacterArrayOf(['m', 'n', 'o']),
                        },
                        config: new DisplayConfig({
                            message: {
                                delay: 10,
                                duration: 100,
                                timingFunction: 'ease'
                            },
                        }),
                    },
                ]
            );
        });
        it('should set control characters in messages', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${delay=100}abcdef',
                    '- abcdef${duration=200}',
                    '- ${[aaa](bbb)}abcdef',
                    '- abcdef${[aaa](bbb)}',
                    '- ${aaa(bbb)}abcdef',
                    '- abcdef${aaa(bbb)}',
                    '- abc${delay=100}def${duration=200}ghi${[jkl](/mno)}pqr${stu(vwx)}yz', //eslint-disable-line max-len
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf('delay', '100')
                            ].concat(normalCharacterArrayOf(
                                ['a', 'b', 'c', 'd', 'e', 'f']
                            )),
                        },
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(
                                ['a', 'b', 'c', 'd', 'e', 'f']
                            ).concat([
                                keyValueControlCharacterOf('duration', '200')
                            ]),
                        },
                    },
                    {
                        message: {
                            letters: [
                                hyperlinkControlCharacterOf('aaa', 'bbb')
                            ].concat(normalCharacterArrayOf(
                                ['a', 'b', 'c', 'd', 'e', 'f']
                            )),
                        },
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(
                                ['a', 'b', 'c', 'd', 'e', 'f']
                            ).concat([
                                hyperlinkControlCharacterOf('aaa', 'bbb')
                            ]),
                        },
                    },
                    {
                        message: {
                            letters: [
                                rubyControlCharacterOf('aaa', 'bbb')
                            ].concat(normalCharacterArrayOf(
                                ['a', 'b', 'c', 'd', 'e', 'f']
                            )),
                        },
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(
                                ['a', 'b', 'c', 'd', 'e', 'f']
                            ).concat([
                                rubyControlCharacterOf('aaa', 'bbb')
                            ]),
                        },
                    },
                    {
                        message: {
                            letters: normalCharacterArrayOf(
                                ['a', 'b', 'c']
                            ).concat([
                                keyValueControlCharacterOf('delay', '100')
                            ]).concat(normalCharacterArrayOf(
                                ['d', 'e', 'f']
                            )).concat([
                                keyValueControlCharacterOf('duration', '200')
                            ]).concat(normalCharacterArrayOf(
                                ['g', 'h', 'i']
                            )).concat([
                                hyperlinkControlCharacterOf('jkl', '/mno')
                            ]).concat(normalCharacterArrayOf(
                                ['p', 'q', 'r']
                            )).concat([
                                rubyControlCharacterOf('stu', 'vwx')
                            ]).concat(normalCharacterArrayOf(
                                ['y', 'z']
                            )),
                        },
                    },
                ]
            );
        });
        it('should set a control character to change a delay time in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${delay=100}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf('delay', '100')
                            ],
                        },
                    },
                ]
            );
        });
        it('should set a control character to change a display duration in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${duration=200}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf('duration', '200')
                            ],
                        },
                    },
                ]
            );
        });
        it('should set a control character to change a time function in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${timeFunction=ease}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'timeFunction', 'ease'
                                )
                            ],
                        },
                    },
                ]
            );
        });
        it('should set a control character to change font size in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${fontSize=10px}',
                    '- ${fontSize=medium}',
                    '- ${fontSize=small}',
                    '- ${fontSize=large}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontSize', '10px'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontSize', 'medium'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontSize', 'small'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontSize', 'large'
                                ),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set a control character to change font style in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${fontStyle=normal}',
                    '- ${fontStyle=italic}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontStyle', 'normal'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontStyle', 'italic'
                                ),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set a control character to change a font family in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${fontFamily=sans-serif}',
                    '- ${fontFamily=}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontFamily', 'sans-serif'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontFamily', ''
                                ),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set a control character to change font weight in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${fontWeight=normal}',
                    '- ${fontWeight=bold}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontWeight', 'normal'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'fontWeight', 'bold'
                                ),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set a control character to change font color in messages', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${color=#000000}',
                    '- ${color=000000}',
                    '- ${color=red}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'color', '#000000'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'color', '000000'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                keyValueControlCharacterOf(
                                    'color', 'red'
                                ),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set hyperlink control characters in messages', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${[aaa](../bbb/)}',
                    '- ${[aaa](bbb/ccc)}',
                    '- ${[aaa](/bbb/ccc.html)}',
                    '- ${[aaa](http://example.com/)}',
                    '- ${[aaa](https://example.com/bbb/ccc)}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                hyperlinkControlCharacterOf(
                                    'aaa', '../bbb/'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                hyperlinkControlCharacterOf(
                                    'aaa', 'bbb/ccc'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                hyperlinkControlCharacterOf(
                                    'aaa', '/bbb/ccc.html'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                hyperlinkControlCharacterOf(
                                    'aaa', 'http://example.com/'
                                ),
                            ],
                        }
                    },
                    {
                        message: {
                            letters: [
                                hyperlinkControlCharacterOf(
                                    'aaa', 'https://example.com/bbb/ccc'
                                ),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set a control character to delay messages displaying', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${sleep=1000}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                sleepControlCharacterOf('1000'),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set a control character to display ruby', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- ${word(ruby)}',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        message: {
                            letters: [
                                rubyControlCharacterOf('word', 'ruby'),
                            ],
                        }
                    },
                ]
            );
        });
        it('should set status message', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- if:',
                    '  - name: flag1',
                    '    value: on',
                    '  status:',
                    '    name: flag1',
                    '    display: aaa',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        if: [
                            { name: 'flag1', value: 'on' },
                        ],
                        status: { name: 'flag1', display: 'aaa' },
                    },
                ]
            );
        });
        it('should set sound', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- sound: abc.mp3',
                    '- sound:',
                    '  - abc.mp3',
                    '  - def.mp3',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        sound: {
                            source: [
                                'abc.mp3',
                            ],
                        }
                    },
                    {
                        sound: {
                            source: [
                                'abc.mp3',
                                'def.mp3',
                            ]
                        },
                    },
                ]
            );
        });
        it('should set a background image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    image: abc.jpg',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            image: 'abc.jpg',
                        },
                    },
                ]
            );
        });
        it('should set a background image with wait', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    image: abc.jpg',
                    '  next: wait',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            image: 'abc.jpg',
                        },
                        next: 'wait',
                    },
                ]
            );
        });
        it('should set a background image with a display configuration', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    image: abc.jpg',
                    '  config:',
                    '    duration: 100',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            image: 'abc.jpg',
                        },
                        config: new DisplayConfig({
                            background: { duration: 100 },
                        }),
                    },
                ]
            );
        });
        it('should set event to remove background image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    control: remove',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            control: 'remove',
                        },
                    },
                ]
            );
        });
        it('should set event to remove a background image with wait', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    control: remove',
                    '  next: wait',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            control: 'remove',
                        },
                        next: 'wait',
                    },
                ]
            );
        });
        it('should set a background color', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    color: black',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            color: 'black',
                        },
                    },
                ]
            );
        });
        it('should set background color with wait', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    color: black',
                    '  next: wait',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            color: 'black',
                        },
                        next: 'wait',
                    },
                ]
            );
        });
        it('should set background color with a display configuration', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- background:',
                    '    color: black',
                    '  config:',
                    '    duration: 100',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        background: {
                            color: 'black',
                        },
                        config: new DisplayConfig({
                            background: { duration: 100 },
                        }),
                    },
                ]
            );
        });
        it('should set an overlay', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- overlay:',
                    '    color: black',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        overlay: {
                            color: 'black',
                            opacity: '1.0',
                        },
                    },
                ]
            );
        });
        it('should set an overlay with wait', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- overlay:',
                    '    color: black',
                    '  next: wait',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        overlay: {
                            color: 'black',
                            opacity: '1.0',
                        },
                        next: 'wait',
                    },
                ]
            );
        });
        it('should set an overlay with a display configuration', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- overlay:',
                    '    color: black',
                    '  config:',
                    '    duration: 100',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        overlay: {
                            color: 'black',
                            opacity: '1.0',
                        },
                        config: new DisplayConfig({
                            overlay: { duration: 100 },
                        }),
                    },
                ]
            );
        });
        it('should set an event to stop background music', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- bgm: stop',
                    '- bgm: stop',
                    '  duration: 1000',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        bgm: {
                            control: 'stop',
                            head: 0,
                            loop: true,
                            sources: [],
                            duration: 0,
                        },
                    },
                    {
                        bgm: {
                            control: 'stop',
                            head: 0,
                            loop: true,
                            sources: [],
                            duration: 1000,
                        },
                    },
                ]
            );
        });
        it('should set background music', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- bgm: abc.mp3',
                    '- bgm:',
                    '  - abc.mp3',
                    '  - def.mp3',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        bgm: {
                            head: 0,
                            loop: true,
                            sources: [
                                'abc.mp3',
                            ],
                        },
                    },
                    {
                        bgm: {
                            head: 0,
                            loop: true,
                            sources: [
                                'abc.mp3',
                                'def.mp3',
                            ],
                        },
                    },
                ]
            );
        });
        it('should set background music without a loop', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- bgm: abc.mp3',
                    '  loop: none',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        bgm: {
                            loop: false,
                            sources: [
                                'abc.mp3',
                            ],
                        },
                    },
                ]
            );
        });
        it('should set background music with a partial loop', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- bgm: abc.mp3',
                    '  loop:',
                    '    head: 2.5',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        bgm: {
                            head: 2.5,
                            loop: true,
                            sources: [
                                'abc.mp3',
                            ],
                        },
                    },
                ]
            );
        });
        it('should set an image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    source: abc.jpg',
                    '    x: 10',
                    '    y: 10',
                    '- image:',
                    '    name: abc',
                    '    source: abc.jpg',
                    '    x: 10px',
                    '    y: 10px',
                    '    width: 10px',
                    '    height: 10px',
                    '    z: -5',
                    '- image:',
                    '    name: abc',
                    '    source: abc.jpg',
                    '    x: 10%',
                    '    y: 10%',
                    '    width: 100%',
                    '    height: 100%',
                    '    scaleX: 0.1',
                    '    scaleY: 0.1',
                    '- image:',
                    '    name: abc',
                    '    source: abc.jpg',
                    '    x: 0',
                    '    y: 0',
                    '    rotateX: 60deg',
                    '    rotateY: -60deg',
                    '    rotateZ: 180deg',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            source: 'abc.jpg',
                            x: '10px',
                            y: '10px',
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            source: 'abc.jpg',
                            x: '10px',
                            y: '10px',
                            width: '10px',
                            height: '10px',
                            z: -5,
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            source: 'abc.jpg',
                            x: '10%',
                            y: '10%',
                            width: '100%',
                            height: '100%',
                            scaleX: 0.1,
                            scaleY: 0.1,
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            source: 'abc.jpg',
                            x: '0',
                            y: '0',
                            rotateX: '60deg',
                            rotateY: '-60deg',
                            rotateZ: '180deg',
                        }
                    },
                ]
            );
        });
        it('should set an event to move an image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    x: 10',
                    '    y: 10',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            x: '10px',
                            y: '10px',
                        }
                    },
                ]
            );
        });
        it('should set an event to move an image with a configuration', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    x: 10',
                    '    y: 10',
                    '  config:',
                    '    duration: 100',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            x: '10px',
                            y: '10px',
                        },
                        config: new DisplayConfig({
                            image: {
                                duration: 100,
                            },
                        }),
                    },
                ]
            );
        });
        it('should set an event to scale an image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    scaleX: 0.1',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            scaleX: 0.1,
                        }
                    },
                ]
            );
        });
        it('should set an event to scale an image with a configuration', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    scaleY: 0.1',
                    '  config:',
                    '    duration: 100',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            scaleY: 0.1,
                        },
                        config: new DisplayConfig({
                            image: {
                                duration: 100,
                            },
                        }),
                    },
                ]
            );
        });
        it('should set an event to rotate an image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    rotateX: 180deg',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            rotateX: '180deg',
                        }
                    },
                ]
            );
        });
        it('should set an event to rotate an image with a configuration', function () { //eslint-disable-line max-len
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    rotateY: 180deg',
                    '  config:',
                    '    duration: 100',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            rotateY: '180deg',
                        },
                        config: new DisplayConfig({
                            image: {
                                duration: 100,
                            },
                        }),
                    },
                ]
            );
        });
        it('should set an event to remove an image', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    control: remove',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            control: 'remove',
                        }
                    },
                ]
            );
        });
        it('should set an event to move an image with wait', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- image:',
                    '    name: abc',
                    '    x: 10',
                    '    y: 10',
                    '  next: wait',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        image: {
                            name: 'abc',
                            x: '10px',
                            y: '10px',
                        },
                        next: 'wait',
                    },
                ]
            );
        });
        it('should set an event to load another scenario', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- load: abc.yml',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        load: 'abc.yml',
                    },
                ]
            );
        });
        it('should set an event to wait', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- wait: 1000',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    { wait: 1000 },
                ]
            );
        });
        it('should set an event to set a flag', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- status:',
                    '    name: flag1',
                    '    value: on',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        status: {
                            name: 'flag1',
                            value: 'on',
                        },
                    },
                ]
            );
        });
        it('should set a branch condition', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- if:',
                    '  - name: flag1',
                    '    value: on',
                    '  - name: flag2',
                    '    value: on',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url, false);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    {
                        if: [
                            {
                                name: 'flag1',
                                value: 'on',
                            },
                            {
                                name: 'flag2',
                                value: 'on',
                            },
                        ],
                    },
                ]
            );
        });
    });

    describe('#init()', function () {
        it('should reset pos', function () {
            // arrange
            scenario.pos = 20;

            // act
            scenario.init(0);

            // assert
            assert.equal(scenario.progress.pos, 0);
        });
        it('should bind click on next button', function () {
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);

            // act
            scenario.init();

            // assert
            assert(nextButtonMock.click.called)
        });
    });

    describe('#display()', function () {
        it('should display all letters in the sentence', function () {
            // arrange
            let bStub = mockOfLetterElement();
            let cStub = mockOfLetterElement();
            scenario.$.withArgs('<span>b</span>').returns(bStub);
            scenario.$.withArgs('<span>c</span>').returns(cStub);
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);
            let aLetterStub = normalCharacterOf('b');
            scenario.directions = [
                {
                    message: {
                        letters: [aLetterStub]
                    }
                },
                {
                    message: {
                        letters: normalCharacterArrayOf(['b', 'c'])
                    }
                },
                {
                    message: {
                        letters: normalCharacterArrayOf(['d', 'e', 'f'])
                    }
                },
            ];

            // act
            scenario.display(1);

            // assert
            assert(displayMock.append.withArgs(bStub).called);
            assert(displayMock.append.withArgs(cStub).called);

        });

        it('should concatenate sentences if willFlush is false', function () {
            // arrange
            scenario.directions = [
                {
                    message: {
                        letters: normalCharacterArrayOf(
                            ['a', 'b', 'c']
                        )
                    },
                    flush: 'none',
                    concat: ' ',
                },
                {
                    message: {
                        letters: normalCharacterArrayOf(
                            ['d', 'e', 'f']
                        )
                    },
                },
            ];
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);
            let concatStub = {
                css: sinon.stub().returnsThis(),
                delay: sinon.stub().returnsThis(),
                queue: sinon.stub().returnsThis(),
            };
            scenario.$.withArgs('<span> </span>').returns(concatStub);
            scenario.willFlush = false;

            // act
            scenario.display(0);
            scenario.flush();
            scenario.display(1);

            // assert
            assert(displayMock.append.withArgs(concatStub).called);
        });
        it('should not change font style after a message whose font style is changed', function () { //eslint-disable-line max-len
            // arrange
            scenario.progress.displayConfig.message.duration = 500;
            scenario.progress.displayConfig.message.delay = 50;
            scenario.directions = [
                {
                    message: {
                        letters: normalCharacterArrayOf(
                            ['a', 'b', 'c']
                        ).concat([
                            keyValueControlCharacterOf('duration', '0'),
                            keyValueControlCharacterOf('delay', '0'),
                            keyValueControlCharacterOf('fontSize', 'large'),
                            keyValueControlCharacterOf('fontWeight', 'bold'),
                        ]).concat(normalCharacterArrayOf(
                            ['d', 'e', 'f']
                        )),
                    },
                },
            ];
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);

            // act
            scenario.display(0);
            scenario.display(1);

            // assert
            assert.equal(
                scenario.progress.displayConfig.message.duration,
                500
            );
            assert.equal(
                scenario.progress.displayConfig.message.delay,
                50
            );
            assert.equal(
                scenario.progress.displayConfig.message.fontSize,
                'medium'
            );
            assert.equal(
                scenario.progress.displayConfig.message.fontStyle,
                'normal'
            );
        });
        it('should set a flag', function () {
            // arrange
            scenario.progress.status['flag1'] = new Flag({
                name: 'flag1', value: 'off'
            });
            scenario.directions = [
                {
                    status: {
                        name: 'flag1', value: 'on', display: 'flag1 is on'
                    },
                },
                {
                    status: {
                        name: 'flag2', value: 'off'
                    },
                },
                {
                    status: {
                        name: 'add', value: 1
                    },
                },
                {
                    status: {
                        name: 'multiply', value: 1
                    },
                },
                {
                    status: {
                        name: 'add', value: { type: 'add', by: 1 }
                    },
                },
                {
                    status: {
                        name: 'multiply', value: { type: 'multiply', by: 3 }
                    },
                },
            ];
            scenario.progress.pos = 0;

            // act
            scenario.display(0);

            // assert
            assert.deepEqual(
                scenario.progress.status['flag1'],
                { name: 'flag1', value: 'on', display: 'flag1 is on' }
            );
            assert.deepEqual(
                scenario.progress.status['flag2'],
                { name: 'flag2', value: 'off', display: 'none' }
            );
            assert.deepEqual(
                scenario.progress.status['add'],
                { name: 'add', value: 2, display: 'none' }
            );
            assert.deepEqual(
                scenario.progress.status['multiply'],
                { name: 'multiply', value: 3, display: 'none' }
            );
        });
        it('should display all letters in the sentence only if a condition is satisfied', function () { //eslint-disable-line max-len
            // arrange
            let bStub = mockOfLetterElement();
            let cStub = mockOfLetterElement();
            let dStub = mockOfLetterElement();
            scenario.$.withArgs('<span>b</span>').returns(bStub);
            scenario.$.withArgs('<span>c</span>').returns(cStub);
            scenario.$.withArgs('<span>d</span>').returns(cStub);
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);
            let aLetterStub = normalCharacterOf('b');
            scenario.progress.status['flag1'] = { value: 'on' };
            scenario.progress.status['flag2'] = { value: 'on' };
            scenario.progress.status['flag3'] = { value: 'off' };
            scenario.directions = [
                {
                    message: {
                        letters: [aLetterStub]
                    }
                },
                {
                    if: [
                        {
                            name: 'flag1',
                            value: 'on',
                        },
                        {
                            name: 'flag2',
                            value: 'on',
                        },
                    ],
                    message: {
                        letters: normalCharacterArrayOf(['b', 'c'])
                    }
                },
                {
                    if: [
                        {
                            name: 'flag1',
                            value: 'on',
                        },
                        {
                            name: 'flag2',
                            value: 'on',
                        },
                        {
                            name: 'flag3',
                            value: 'on',
                        },
                    ],
                    message: {
                        letters: normalCharacterArrayOf(['d', 'e', 'f'])
                    }
                },
            ];

            // act
            scenario.display(1);
            scenario.display(2);

            // assert
            assert(displayMock.append.withArgs(bStub).called);
            assert(displayMock.append.withArgs(cStub).called);
            assert(displayMock.append.withArgs(dStub).notCalled);
        });
    });

    describe('#displayBackgroundImage()', function () {
        it('should display an image in the background window', function () {
            // arrange
            let stub = mockOfBackgroundImageElement();
            let backgroundMock = mockOfBackgroundElement();
            scenario.$.withArgs('<img>', {
                src: 'a.jpg',
                class: 'backgroundImage active',
            }).returns(stub);
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
            ).returns(backgroundMock);

            // act
            scenario.displayBackgroundImage('a.jpg');

            // assert
            assert(backgroundMock.append.withArgs(stub).called);
        });
    });

    describe('#displayOverlay()', function () {
        it('should display an overlay in the background window', function () {
            // arrange
            let stub = mockOfOverlayElement();
            let backgroundMock = mockOfBackgroundElement();
            scenario.$.withArgs('<div>', {
                class: 'overlay',
            }).returns(stub);
            scenario.$.withArgs(
                scenario.progress.displayConfig.overlay.target
            ).returns(backgroundMock);
            let overlay = { color: 'rgba(0,0,0,0.5)', opacity: '1.0' };
            // act
            scenario.displayOverlay(overlay);

            // assert
            assert(backgroundMock.append.withArgs(stub).called);
        });
    });

    describe('#changeBackgroundColor()', function () {
        it('should change background color of the background window', function () { //eslint-disable-line max-len
            // arrange
            let stub = mockOfBackgroundColorElement();
            let backgroundMock = mockOfBackgroundElement();
            scenario.$.withArgs('<div>', {
                class: 'backgroundColor',
            }).returns(stub);
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
            ).returns(backgroundMock);

            // act
            scenario.changeBackgroundColor('#000000');

            // assert
            assert(backgroundMock.append.withArgs(stub).called);
        });
    });

    describe('#changeMessageWindowColor()', function () {
        it('should change background color of the message window', function () {
            // arrange
            let messageWindowMock = mockOfMessageWindowToChangeStyle();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(messageWindowMock);
            scenario.progress.displayConfig.message.background.color = 'black';

            // act
            scenario.changeMessageWindowColor();

            // assert
            assert(messageWindowMock.css.called);
        });
    });

    describe('#moveMessageWindow()', function () {
        it('should change the position of a message window', function () {
            // arrange
            let messageWindowMock = mockOfMessageWindowToChangeStyle();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(messageWindowMock);
            scenario.progress.displayConfig.message.position.x = 100;
            scenario.progress.displayConfig.message.position.y = 100;

            // act
            scenario.moveMessageWindow();

            // assert
            assert(messageWindowMock.css.called);
        });
    });

    describe('#removeBackground()', function () {
        it('should remove a background image', function () {
            // arrange
            let backgroundMock = mockOfBackgroundImageElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
                + ' .backgroundImage.active'
            ).returns(backgroundMock);

            // act
            scenario.removeBackground();

            // assert
            assert(backgroundMock.on.withArgs('transitionend').called);
        });
    });

    describe('#displayImage()', function () {
        it('should display an image in the background window', function () {
            // arrange
            let stub = mockOfImageElement();
            let backgroundMock = mockOfBackgroundElement();
            let image = new Image({
                name: 'a',
                source: 'a.jpg',
                x: 10,
                y: 20,
            });
            scenario.$.withArgs('<img>', {
                id: 'a',
                src: 'a.jpg',
            }).returns(stub);
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
            ).returns(backgroundMock);

            // act
            scenario.displayImage(image);

            // assert
            assert(backgroundMock.append.withArgs(stub).called);
        });
    });

    describe('#waitForImage()', function () {
        it('should bind transitionend on an image', function () {
            // arrange
            let imageElementMock = mockOfImageElement();
            let image = {
                name: 'abc',
                source: 'abc.jpg',
                x: 10,
                y: 20,
            };
            scenario.$.withArgs('#abc').returns(imageElementMock);

            // act
            scenario.waitForImage(image);

            // assert
            assert(imageElementMock.one.called);
        });
    });

    describe('#waitForBackgroundImage()', function () {
        it('should bind transitionend on a background image', function () {
            // arrange
            let imageElementMock = mockOfBackgroundImageElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
                + ' .backgroundImage.active'
            ).returns(imageElementMock);

            // act
            scenario.waitForBackgroundImage();

            // assert
            assert(imageElementMock.one.called);
        });
    });

    describe('#waitForOverlay()', function () {
        it('should bind transitionend on an overlay', function () {
            // arrange
            let overlayElementMock = mockOfOverlayElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.overlay.target + ' .overlay'
            ).returns(overlayElementMock);

            // act
            scenario.waitForOverlay();

            // assert
            assert(overlayElementMock.one.called);
        });
    });

    describe('#waitForBackgroundColor()', function () {
        it('should bind transitionend on a background window', function () {
            // arrange
            let backgroundElementMock = mockOfBackgroundColorElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
                + ' .backgroundColor'
            ).returns(backgroundElementMock);

            // act
            scenario.waitForBackgroundColor();

            // assert
            assert(backgroundElementMock.one.called);
        });
    });

    describe('#waitForChangingMessageWindowColor()', function () {
        it('should bind transitionend on a message window', function () {
            // arrange
            let messageWindowElementMock = mockOfMessageWindowToChangeStyle();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(messageWindowElementMock);

            // act
            scenario.waitForChangingMessageWindowColor();

            // assert
            assert(messageWindowElementMock.one.called);
        });
    });

    describe('#waitForMovingMessageWindow()', function () {
        it('should bind transitionend on a message window', function () {
            // arrange
            let messageWindowElementMock = mockOfMessageWindowToChangeStyle();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(messageWindowElementMock);

            // act
            scenario.waitForMovingMessageWindow();

            // assert
            assert(messageWindowElementMock.one.called);
        });
    });

    describe('#waitForSeconds()', function () {
        it('should off click on the next button', function () {
            // arrange
            let nextButtonStub = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonStub);

            // act
            scenario.waitForSeconds(0);

            // assert
            assert(nextButtonStub.off.called);
        });
    });

    describe('#flush()', function () {
        it('should flush display', function () {
            // arrange
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);

            // act
            scenario.flush();

            // assert
            assert(displayMock.text.withArgs('').called);
        });
        it('should not flush display if willFlush is false', function () {
            // arrange
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);
            scenario.willFlush = false;

            // act
            scenario.flush();

            // assert
            assert(displayMock.text.withArgs('').notCalled);
            assert(scenario.willFlush);
        });
    });

    describe('#displayMessage()', function () {
        it('should append letters in the given sentence', function () {
            // arrange
            let aStub = mockOfLetterElement();
            let bStub = mockOfLetterElement();
            let cStub = mockOfLetterElement();
            scenario.$.withArgs('<span>a</span>').returns(aStub);
            scenario.$.withArgs('<span>b</span>').returns(bStub);
            scenario.$.withArgs('<span>c</span>').returns(cStub);
            let displayMock = mockOfMessageWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock)
            let message = {
                letters: normalCharacterArrayOf(['a', 'b', 'c']),
            };

            // act
            scenario.displayMessage(message);

            // assert
            assert(displayMock.append.withArgs(aStub).called);
            assert(displayMock.append.withArgs(bStub).called);
            assert(displayMock.append.withArgs(cStub).called);
        });
        it('should change display configuration with a control character', function () { //eslint-disable-line max-len
            // arrange
            let config = { message: { duration: 100, delay: 10 } };
            let message = {
                letters: normalCharacterArrayOf(
                    ['a', 'b', 'c']
                ).concat([
                    keyValueControlCharacterOf('duration', '200'),
                    keyValueControlCharacterOf('delay', '20'),
                ]).concat(normalCharacterArrayOf(
                    ['d', 'e', 'f']
                )),
            };

            // act
            scenario.displayMessage(message, config);

            // assert
            assert.equal(config.message.duration, 200);
            assert.equal(config.message.delay, 20);
        });
        it('should change display configuration with a control character', function () { //eslint-disable-line max-len
            // arrange
            let config = {
                message: {
                    duration: 100,
                    delay: 10,
                    fontWeight: 'normal',
                    fontSize: 'medium',
                },
            };
            let message = {
                letters: normalCharacterArrayOf(
                    ['a', 'b', 'c']
                ).concat([
                    keyValueControlCharacterOf('fontSize', 'large'),
                    keyValueControlCharacterOf('fontWeight', 'bold'),
                ]).concat(normalCharacterArrayOf(
                    ['d', 'e', 'f']
                )),
            };

            // act
            scenario.displayMessage(message, config);

            // assert
            assert.equal(config.message.fontSize, 'large');
            assert.equal(config.message.fontWeight, 'bold');
        });
        it('should display a hyperlink', function () {
            // arrange
            let message = {
                letters: normalCharacterArrayOf(
                    ['a', 'b', 'c']
                ).concat([
                    hyperlinkControlCharacterOf('xyz', 'yyy'),
                ]).concat(normalCharacterArrayOf(
                    ['d', 'e', 'f']
                )),
            };
            let displayMock = mockOfMessageWindowToDisplay();
            let xStub = mockOfLetterElement()
            let yStub = mockOfLetterElement();
            let zStub = mockOfLetterElement();
            scenario.$.withArgs('<a>', { href: 'yyy' }).returns(displayMock);
            scenario.$.withArgs('<span>x</span>').returns(xStub);
            scenario.$.withArgs('<span>y</span>').returns(yStub);
            scenario.$.withArgs('<span>z</span>').returns(zStub);

            // act
            scenario.displayMessage(message);

            // assert
            assert(displayMock.append.withArgs(xStub).called);
            assert(displayMock.append.withArgs(yStub).called);
            assert(displayMock.append.withArgs(zStub).called);
        });

    });

    describe('#createLetterElement()', function () {
        it('should create one letter', function () {
            // arrange

            // act
            scenario.createLetterElement('s', 10);

            // assert
            assert(scenario.$.withArgs('<span>s</span>').called);
        });
        it('should create newline', function () {
            // arrange

            // act
            scenario.createLetterElement('\n', 10);

            // assert
            assert(scenario.$.withArgs('<br />').called);
        });
    });

    describe('#playBgm()', function () {
        it('should create an audio element which repeats', function () {
            // arrange
            let audioStub = mockOfAudio();
            scenario.$.withArgs('<audio>').returns(audioStub);
            scenario.$.withArgs('<audio>');
            let oggStub = sinon.stub();
            scenario.$
                .withArgs('<source>', { src: 'bgm.ogg' })
                .returns(oggStub);
            let mp3Stub = sinon.stub();
            scenario.$
                .withArgs('<source>', { src: 'bgm.mp3' })
                .returns(mp3Stub);

            // act
            scenario.playBgm({
                loop: true,
                head: 0,
                sources: ['bgm.ogg', 'bgm.mp3'],
            });

            // assert
            assert(scenario.$.withArgs('<audio>').called);
            assert(scenario.$.withArgs('<source>', { src: 'bgm.ogg' }).called);
            assert(scenario.$.withArgs('<source>', { src: 'bgm.mp3' }).called);
            assert(audioStub.append.withArgs([
                oggStub,
                mp3Stub,
            ]).called);
            assert(audioStub[0].play.called);
            assert(audioStub.on.called);
        });
        it('should create an audio element which does not repeat', function () {
            // arrange
            let audioStub = mockOfAudio();
            scenario.$.withArgs('<audio>').returns(audioStub);
            scenario.$.withArgs('<audio>');
            let oggStub = sinon.stub();
            scenario.$
                .withArgs('<source>', { src: 'bgm.ogg' })
                .returns(oggStub);
            let mp3Stub = sinon.stub();
            scenario.$
                .withArgs('<source>', { src: 'bgm.mp3' })
                .returns(mp3Stub);

            // act
            scenario.playBgm({
                loop: false,
                head: 0,
                sources: ['bgm.ogg', 'bgm.mp3'],
            });

            // assert
            assert(scenario.$.withArgs('<audio>').called);
            assert(scenario.$.withArgs('<source>', { src: 'bgm.ogg' }).called);
            assert(scenario.$.withArgs('<source>', { src: 'bgm.mp3' }).called);
            assert(audioStub.append.withArgs([
                oggStub,
                mp3Stub,
            ]).called);
            assert(audioStub[0].play.called);
            assert(audioStub.on.notCalled);
        });
    });

    describe('#stopBgm()', function () {
        it('should pause and remove an audio element', function () {
            // arrange
            let audioStub = mockOfAudio();
            scenario.$.withArgs('.backgroundMusic').returns(audioStub);

            // act
            scenario.stopBgm({
                control: 'stop',
            });

            // assert
            assert(audioStub.remove.called);
            assert(audioStub[0].pause.called);
        });
    });

    describe('#playSound()', function () {
        it('should create an audio element', function () {
            // arrange
            let audioStub = mockOfAudio();
            scenario.$.withArgs('<audio>').returns(audioStub);
            scenario.$.withArgs('<audio>');
            let oggStub = sinon.stub();
            scenario.$
                .withArgs('<source>', { src: 'sound.ogg' })
                .returns(oggStub);
            let mp3Stub = sinon.stub();
            scenario.$
                .withArgs('<source>', { src: 'sound.mp3' })
                .returns(mp3Stub);

            // act
            scenario.playSound({ source: ['sound.ogg', 'sound.mp3'] });

            // assert
            assert(
                scenario.$.withArgs('<audio>').called
            );
            assert(
                scenario.$.withArgs('<source>', { src: 'sound.ogg' }).called
            );
            assert(
                scenario.$.withArgs('<source>', { src: 'sound.mp3' }).called
            );
            assert(
                audioStub.append.withArgs([oggStub, mp3Stub,]).called
            );
            assert(audioStub.on.withArgs('ended').called);
            assert(audioStub[0].play.called);
        });
    });

    describe('#stopSound()', function () {
        it('should pause and remove an audio element', function () {
            // arrange
            let audioStub = mockOfAudio();
            scenario.$.withArgs('.sound').returns(audioStub);

            // act
            scenario.stopSound();

            // assert
            assert(audioStub.remove.called);
            assert(audioStub[0].pause.called);
        });
    });

    describe('#displayStatusMessage()', function () {
        it('should display a status message in the default status window', function () { //eslint-disable-line max-len
            // arrange
            let name = 'flag1';
            let display = 'flag1 is set';
            let flag1Stub = mockOfFlagElement();
            scenario.$.withArgs('#flag1').returns({ length: 0 });
            scenario.$.withArgs('<div>', { id: name }).returns(flag1Stub);
            let displayMock = mockOfStatusWindowToDisplay();
            scenario.$.withArgs(
                scenario.progress.displayConfig.status.target
            ).returns(displayMock);

            // act
            scenario.displayStatusMessage({
                name: name,
                display: display,
            });

            // assert
            assert(displayMock.append.called);
            assert(flag1Stub.text.calledWith(display));
        });
        it('should display a status message in the given status window', function () { //eslint-disable-line max-len
            // arrange
            let name = 'flag1';
            let display = 'flag1 is set';
            let target = '#anotherStatusWindow';
            let flag1Stub = mockOfFlagElement();
            scenario.$.withArgs('#flag1').returns({ length: 0 });
            scenario.$.withArgs('<div>', { id: name }).returns(flag1Stub);
            let displayMock = mockOfStatusWindowToDisplay();
            scenario.$.withArgs(target).returns(displayMock);

            // act
            scenario.displayStatusMessage({
                name: name,
                display: display,
                target: target,
            });

            // assert
            assert(displayMock.append.called);
            assert(flag1Stub.text.calledWith(display));
        });
        it('should update a status message', function () {
            // arrange
            let name = 'flag1';
            let display = 'flag1 is set';
            let target = 'statusWindow';
            let statusWindowStub = stubOfStatusWindowElement();
            let flag1Stub = mockOfFlagElement();
            flag1Stub.parent = sinon.stub().returns(statusWindowStub);
            scenario.$.withArgs('#flag1').returns(flag1Stub);
            let displayMock = mockOfStatusWindowToDisplay();
            scenario.$.withArgs(target).returns(displayMock);

            // act
            scenario.displayStatusMessage({
                name: name,
                display: display,
                target: target,
            });

            // assert
            assert(flag1Stub.text.calledWith(display));
            assert(flag1Stub.appendTo.notCalled);
        });
        it('should change a status window to display a status message', function () { //eslint-disable-line max-len
            // arrange
            let name = 'flag1';
            let display = 'flag1 is set';
            let target = 'anotherStatusWindow';
            let statusWindowStub = stubOfStatusWindowElement();
            let flag1Stub = mockOfFlagElement();
            flag1Stub.parent = sinon.stub().returns(statusWindowStub);
            scenario.$.withArgs('#flag1').returns(flag1Stub);
            let displayMock = mockOfStatusWindowToDisplay();
            scenario.$.withArgs(target).returns(displayMock);

            // act
            scenario.displayStatusMessage({
                name: name,
                display: display,
                target: target,
            });

            // assert
            assert(flag1Stub.text.calledWith(display));
            assert(flag1Stub.appendTo.calledWith(displayMock));
        });
    });

    describe('#disableUI()', function () {
        it('should off bindings', function () {
            // arrange
            let nextButtonStub = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonStub);
            let saveButtonStub = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.save.target
            ).returns(saveButtonStub);
            let loadButtonStub = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.load.target
            ).returns(loadButtonStub);

            // act
            scenario.disableUI();

            // assert
            assert(nextButtonStub.off.called);
            assert(saveButtonStub.off.called);
            assert(loadButtonStub.off.called);
        });
    });

    describe('#updateButtons()', function () {
        it('should bind click on buttons', function () {
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);
            let saveButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.save.target
            ).returns(saveButtonMock);
            let loadButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.load.target
            ).returns(loadButtonMock);

            // act
            scenario.updateButtons();

            // assert
            assert(nextButtonMock.click.called);
            assert(saveButtonMock.click.called);
            assert(loadButtonMock.click.called);
        });
    });

    describe('#enableNextDirectionButton()', function () {
        it('should bind click on next button', function () {
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);

            // act
            scenario.enableNextDirectionButton();

            // assert
            assert(nextButtonMock.click.called);
        });
    });

    describe('#changeButtonDuringDisplaying()', function () {
        it('should off and bind click on next button and the last letter element', function () { //eslint-disable-line max-len
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);
            let letterElementMock = mockOfLetterElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target + ' > :last'
            ).returns(letterElementMock);

            // act
            scenario.changeButtonDuringDisplaying(false);

            // assert
            assert(nextButtonMock.off.called);
            assert(nextButtonMock.click.called);
            assert(letterElementMock.one.called);
        });
        it('should off click on next button and bind function on the last letter element', function () { //eslint-disable-line max-len
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);
            let letterElementMock = mockOfLetterElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target + ' > :last'
            ).returns(letterElementMock);

            // act
            scenario.changeButtonDuringDisplaying(true);

            // assert
            assert(nextButtonMock.off.called);
            assert(nextButtonMock.click.notCalled);
            assert(letterElementMock.one.called);
        });
        it('should off and bind click on next button and the last letter element with automatic displaying', function () { //eslint-disable-line max-len
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);
            let letterElementMock = mockOfLetterElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target + ' > :last'
            ).returns(letterElementMock);

            // act
            scenario.changeButtonDuringDisplaying(false, 100);

            // assert
            assert(nextButtonMock.off.called);
            assert(nextButtonMock.click.called);
            assert(letterElementMock.one.called);
        });
        it('should off click on next button and bind function on the last letter element with automatic displaying', function () { //eslint-disable-line max-len
            // arrange
            let nextButtonMock = mockOfButton();
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next.target
            ).returns(nextButtonMock);
            let letterElementMock = mockOfLetterElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target + ' > :last'
            ).returns(letterElementMock);

            // act
            scenario.changeButtonDuringDisplaying(true, 100);

            // assert
            assert(nextButtonMock.off.called);
            assert(nextButtonMock.click.notCalled);
            assert(letterElementMock.one.called);
        });
    });

    describe('#removeImages()', function () {
        it('should remove images', function () {
            // arrange
            scenario.progress.images = {
                abc: {
                    name: 'abc',
                    source: 'abc.jpg',
                },
                def: {
                    name: 'def',
                    source: 'def.jpg',
                },
            };
            let imageStubFirst = mockOfImageElement();
            scenario.$.withArgs('#abc').returns(imageStubFirst);
            let imageStubSecond = {
                remove: sinon.spy(),
            };
            scenario.$.withArgs('#def').returns(imageStubSecond);

            // act
            scenario.removeImages();

            // assert
            assert(imageStubFirst.remove.called);
            assert(imageStubSecond.remove.called);
        });
    });

    describe('#removeBackgroundImage()', function () {
        it('should remove a background image', function () {
            // arrange
            let backgroundImageStub = mockOfImageElement();
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
                + ' .backgroundImage'
            ).returns(backgroundImageStub);

            // act
            scenario.removeBackgroundImage();

            // assert
            assert(backgroundImageStub.remove.called);
        });
    });

    describe('#saveProgress()', function () {
        it('should save progress to localStorage', function () {
            // arrange
            let localStorage = {};
            scenario.window = {
                localStorage: localStorage,
            };

            // act
            scenario.saveProgress();

            // assert
            assert(localStorage.progress);
        });
    });

    describe('#loadProgress()', function () {
        it('should load progress from localStorage', function () {
            // arrange
            let progress = {
                pos: 1,
                displayConfig: new DisplayConfig({
                    message: {
                        target: '#messageWindow',
                        delay: 50,
                        duration: 500,
                        timingFunction: 'linear',
                        fontSize: 'medium',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        background: {
                            color: 'transparent',
                            duration: 1000,
                            timingFunction: 'linear',
                        },
                        position: {
                            x: 0,
                            y: 0,
                            width: 'auto',
                            height: 'auto',
                            scaleX: 1,
                            scaleY: 1,
                            rotateX: '0deg',
                            rotateY: '0deg',
                            rotateZ: '0deg',
                            duration: 1000,
                            timingFunction: 'linear',
                        },
                    },
                    background: {
                        target: '#backgroundWindow',
                        duration: 1000,
                        timingFunction: 'linear',
                    },
                    overlay: {
                        target: '#backgroundWindow',
                        duration: 1000,
                        timingFunction: 'linear',
                    },
                    image: {
                        duration: 1000,
                        timingFunction: 'linear',
                    },
                    status: {
                        target: '#statusWindow',
                    },
                    ui: {
                        next: {
                            target: '#nextButton',
                            status: 'available',
                        },
                        save: {
                            target: '#saveButton',
                            status: 'available',
                        },
                        load: {
                            target: '#loadButton',
                            status: 'available',
                        },
                    }
                }),
                images: {
                    abc: {
                        name: 'abc',
                        source: 'abc.png',
                        x: '10px',
                        y: '10px',
                        z: -2,
                    }
                },
                bgmConfig: {
                    sources: ['abc.mp3'],
                    loop: true,
                    head: 0,
                },
                background: {
                    image: 'abc.jpg',
                    color: 'transparent',
                },
                overlay: {
                    color: 'black',
                    opacity: '0.5',
                },
                scenarioUrl: 'abc.yml',
                status: {
                    flag: { value: 'on', display: 'none' },
                    flag2: { value: 'on', display: 'none', target: 'another' },
                },
            };
            scenario.window = {
                localStorage: { progress: JSON.stringify(progress) },
            };

            // act
            scenario.loadProgress();

            // assert
            assert.deepEqual(scenario.progress, progress);
        });
    });
});
