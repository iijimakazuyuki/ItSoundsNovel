const assert = require('chai').assert;
const Scenario = require('../src/scenario.js');
const sinon = require('sinon');

describe('Scenario', function () {
    const scenario = new Scenario();

    before(function () {
        scenario.$ = sinon.stub();
        scenario.$ = scenario.$.returns(scenario.$);
        scenario.$.delay = sinon.stub().returnsThis();
        scenario.$.animate = sinon.stub().returnsThis();
        scenario.$.append = sinon.stub().returnsThis();
        scenario.$.click = sinon.stub().returnsThis();
        scenario.$.css = sinon.stub().returnsThis();
    });

    describe('#load()', function () {
        it('should get content with $ as yaml and set an object', function () {
            // arrange
            scenario.$.get = sinon.stub().yieldsTo(
                'success',
                [
                    '- abc',
                    '- def',
                    '- ghi',
                    '- 1',
                    '- message: jkl',
                    '- config:',
                    '    delay: 10',
                    '    duration: 100',
                    '- config:',
                    '    message:',
                    '      delay: 10',
                    '      duration: 100',
                    '- message: mno',
                    '  config:',
                    '    delay: 10',
                    '    duration: 100',
                    '- sound: abc.mp3',
                    '- sound:',
                    '  - abc.mp3',
                    '  - def.mp3',
                    '- background:',
                    '    image: abc.jpg',
                ].join('\n')
            );
            let url = '';

            // act
            scenario.load(url);

            // assert
            assert.deepEqual(
                scenario.directions,
                [
                    { message: 'abc' },
                    { message: 'def' },
                    { message: 'ghi' },
                    { message: 1 },
                    { message: 'jkl' },
                    {
                        config: { message: { delay: 10, duration: 100 } }
                    },
                    {
                        config: { message: { delay: 10, duration: 100 } }
                    },
                    {
                        message: 'mno',
                        config: { message: { delay: 10, duration: 100 } }
                    },
                    {
                        sound: [
                            'abc.mp3',
                        ],
                    },
                    {
                        sound: [
                            'abc.mp3',
                            'def.mp3',
                        ],
                    },
                    {
                        background: {
                            image: 'abc.jpg',
                        },
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
            scenario.init();

            // assert
            assert.equal(scenario.pos, 0);
        });
        it('should bind click on next button', function () {
            // arrange
            let nextButtonMock = {
                click: sinon.spy()
            };
            scenario.$.withArgs(scenario.config.ui.next).returns(nextButtonMock);

            // act
            scenario.init();

            // assert
            assert(nextButtonMock.click.called)
        });
    });

    describe('#display()', function () {
        it('should display all letters in the sentence', function () {
            // arrange
            let bStub = {
                css: sinon.stub().returnsThis(),
                delay: sinon.stub().returnsThis(),
                animate: sinon.stub().returnsThis(),
            }
            let cStub = {
                css: sinon.stub().returnsThis(),
                delay: sinon.stub().returnsThis(),
                animate: sinon.stub().returnsThis(),
            }
            scenario.$.withArgs('<span>b</span>').returns(bStub);
            scenario.$.withArgs('<span>c</span>').returns(cStub);
            let displayMock = {
                append: sinon.spy()
            };
            scenario.$.withArgs(scenario.config.message.target).returns(displayMock);
            scenario.directions = [
                { message: 'a' },
                { message: 'bc' },
                { message: 'def' },
            ];

            // act
            scenario.display(1);

            // assert
            assert(displayMock.append.withArgs(bStub).called);
            assert(displayMock.append.withArgs(cStub).called);

        });
    });

    describe('#displayBackground()', function () {
        it('should display an image in the background window', function () {
            // arrange
            let stub = {
                css: sinon.stub().returnsThis(),
                fadeIn: sinon.stub().returnsThis(),
            };
            let backgroundMock = {
                append: sinon.spy()
            };
            scenario.$.withArgs('<img>', {
                src: 'a.jpg',
                class: 'backgroundImage',
            }).returns(stub);
            scenario.$.withArgs(scenario.config.background.target).returns(backgroundMock);

            // act
            scenario.displayBackground('a.jpg');

            // assert
            assert(backgroundMock.append.withArgs(stub).called);
        });
    });

    describe('#flush()', function () {
        it('should flush display', function () {
            // arrange
            let displayMock = {
                text: sinon.spy()
            }
            scenario.$.withArgs(scenario.config.message.target).returns(displayMock);

            // act
            scenario.flush();

            // assert
            assert(displayMock.text.withArgs('').called);
        });
    });

    describe('#appendLetterElement()', function () {
        it('should append one letter to display', function () {
            // arrange
            let letterStub = {
                css: sinon.stub().returnsThis(),
                delay: sinon.stub().returnsThis(),
                animate: sinon.stub().returnsThis(),
            }
            scenario.$.withArgs('<span>s</span>').returns(letterStub);
            let displayMock = {
                append: sinon.spy()
            };
            scenario.$.withArgs(scenario.config.message.target).returns(displayMock)

            // act
            scenario.appendLetterElement('s', 10);

            // assert
            assert(displayMock.append.withArgs(letterStub).called);
        });
    });

    describe('#play()', function () {
        it('should create an audio element', function () {
            // arrange
            let audioStub = {
                append: sinon.spy(),
            };
            audioStub[0] = {
                play: sinon.spy(),
            };
            scenario.$.withArgs('<audio>').returns(audioStub);
            scenario.$.withArgs('<audio>');
            let oggStub = sinon.stub();
            scenario.$.withArgs('<source>', { src: 'sound.ogg' }).returns(oggStub);
            let mp3Stub = sinon.stub();
            scenario.$.withArgs('<source>', { src: 'sound.mp3' }).returns(mp3Stub);

            // act
            scenario.play(['sound.ogg', 'sound.mp3']);

            // assert
            assert(scenario.$.withArgs('<audio>').called);
            assert(scenario.$.withArgs('<source>', { src: 'sound.ogg' }).called);
            assert(scenario.$.withArgs('<source>', { src: 'sound.mp3' }).called);
            assert(audioStub.append.withArgs([
                oggStub,
                mp3Stub,
            ]).called);
            assert(audioStub[0].play.called);
        });
    });
});
