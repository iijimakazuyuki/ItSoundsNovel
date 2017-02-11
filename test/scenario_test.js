const assert = require('chai').assert;
const Scenario = require('../src/scenario.js');
const sinon = require('sinon');

describe('Scenario', function () {
    const scenario = new Scenario();

    beforeEach(function () {
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
                    '- message: mno',
                    '  next: wait',
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
                    '- background:',
                    '    image: abc.jpg',
                    '  next: wait',
                    '- background:',
                    '    image: abc.jpg',
                    '  config:',
                    '    duration: 100',
                    '- background:',
                    '    control: remove',
                    '- background:',
                    '    control: remove',
                    '  next: wait',
                    '- bgm: stop',
                    '- bgm: abc.mp3',
                    '- bgm:',
                    '  - abc.mp3',
                    '  - def.mp3',
                    '- bgm: abc.mp3',
                    '  loop: none',
                    '- bgm: abc.mp3',
                    '  loop:',
                    '    head: 2.5',
                    '- image:',
                    '    name: abc',
                    '    source: abc.jpg',
                    '    x: 10',
                    '    y: 10',
                    '- image:',
                    '    name: abc',
                    '    source: abc.jpg',
                    '    x: 10',
                    '    y: 10',
                    '    z: -5',
                    '- image:',
                    '    name: abc',
                    '    x: 10',
                    '    y: 10',
                    '- image:',
                    '    name: abc',
                    '    x: 10',
                    '    y: 10',
                    '  config:',
                    '    duration: 100',
                    '- image:',
                    '    name: abc',
                    '    control: remove',
                    '- image:',
                    '    name: abc',
                    '    x: 10',
                    '    y: 10',
                    '  next: wait',
                    '- load: abc.yml',
                    '- wait: 1000',
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
                        message: 'mno',
                        next: 'wait',
                    },
                    {
                        config: {
                            message: { delay: 10, duration: 100 },
                            background: {},
                            image: {},
                        }
                    },
                    {
                        config: {
                            message: { delay: 10, duration: 100 },
                            background: {},
                            image: {},
                        }
                    },
                    {
                        message: 'mno',
                        config: {
                            message: { delay: 10, duration: 100 },
                            background: {},
                            image: {},
                        }
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
                    {
                        background: {
                            image: 'abc.jpg',
                        },
                        next: 'wait',
                    },
                    {
                        background: {
                            image: 'abc.jpg',
                        },
                        config: {
                            background: { duration: 100 },
                            message: {},
                            image: {},
                        }
                    },
                    {
                        background: {
                            control: 'remove',
                        },
                    },
                    {
                        background: {
                            control: 'remove',
                        },
                        next: 'wait',
                    },
                    {
                        bgm: {
                            control: 'stop',
                            head: 0,
                            loop: true,
                            sources: [],
                        },
                    },
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
                    {
                        bgm: {
                            loop: false,
                            sources: [
                                'abc.mp3',
                            ],
                        },
                    },
                    {
                        bgm: {
                            head: 2.5,
                            loop: true,
                            sources: [
                                'abc.mp3',
                            ],
                        },
                    },
                    {
                        image: {
                            name: 'abc',
                            source: 'abc.jpg',
                            x: 10,
                            y: 10,
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            source: 'abc.jpg',
                            x: 10,
                            y: 10,
                            z: -5,
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            x: 10,
                            y: 10,
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            x: 10,
                            y: 10,
                        },
                        config: {
                            image: {
                                duration: 100,
                            },
                            background: {},
                            message: {},
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            control: 'remove',
                            x: 0,
                            y: 0,
                        }
                    },
                    {
                        image: {
                            name: 'abc',
                            x: 10,
                            y: 10,
                        },
                        next: 'wait',
                    },
                    {
                        load: 'abc.yml',
                    },
                    { wait: 1000 },
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
            let nextButtonMock = {
                click: sinon.spy()
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
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
            let bStub = {
                css: sinon.stub().returnsThis(),
                delay: sinon.stub().returnsThis(),
                queue: sinon.stub().returnsThis(),
            }
            let cStub = {
                css: sinon.stub().returnsThis(),
                delay: sinon.stub().returnsThis(),
                queue: sinon.stub().returnsThis(),
            }
            scenario.$.withArgs('<span>b</span>').returns(bStub);
            scenario.$.withArgs('<span>c</span>').returns(cStub);
            let displayMock = {
                append: sinon.spy()
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);
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
                on: sinon.stub().returnsThis(),
            };
            let backgroundMock = {
                append: sinon.spy()
            };
            scenario.$.withArgs('<img>', {
                src: 'a.jpg',
                class: 'backgroundImage active',
            }).returns(stub);
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target
            ).returns(backgroundMock);

            // act
            scenario.displayBackground('a.jpg');

            // assert
            assert(backgroundMock.append.withArgs(stub).called);
        });
    });

    describe('#removeBackground()', function () {
        it('should remove a background image', function () {
            // arrange
            let backgroundMock = {
                css: sinon.stub().returnsThis(),
                on: sinon.spy(),
            };
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
            let stub = {
                css: sinon.stub().returnsThis(),
                on: sinon.stub().returnsThis(),
            };
            let backgroundMock = {
                append: sinon.spy()
            };
            let image = {
                name: 'a',
                source: 'a.jpg',
                x: 10,
                y: 20,
            };
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
            let imageElementMock = {
                one: sinon.spy(),
            };
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

    describe('#waitForBackground()', function () {
        it('should bind transitionend on a background image', function () {
            // arrange
            let imageElementMock = {
                one: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target + ' .backgroundImage.active'
            ).returns(imageElementMock);

            // act
            scenario.waitForBackground();

            // assert
            assert(imageElementMock.one.called);
        });
    });

    describe('#waitForSeconds()', function () {
        it('should off click on the next button', function () {
            // arrange
            let nextButtonStub = {
                off: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
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
            let displayMock = {
                text: sinon.spy()
            }
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock);

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
                queue: sinon.stub().returnsThis(),
            }
            scenario.$.withArgs('<span>s</span>').returns(letterStub);
            let displayMock = {
                append: sinon.spy()
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target
            ).returns(displayMock)

            // act
            scenario.appendLetterElement('s', 10);

            // assert
            assert(displayMock.append.withArgs(letterStub).called);
        });
    });

    describe('#playBgm()', function () {
        it('should create an audio element which repeats', function () {
            // arrange
            let audioStub = {
                append: sinon.spy(),
                on: sinon.spy(),
            };
            audioStub[0] = {
                play: sinon.spy(),
            }
            scenario.$.withArgs('<audio>').returns(audioStub);
            scenario.$.withArgs('<audio>');
            let oggStub = sinon.stub();
            scenario.$.withArgs('<source>', { src: 'bgm.ogg' }).returns(oggStub);
            let mp3Stub = sinon.stub();
            scenario.$.withArgs('<source>', { src: 'bgm.mp3' }).returns(mp3Stub);

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
            let audioStub = {
                append: sinon.spy(),
                on: sinon.spy(),
            };
            audioStub[0] = {
                play: sinon.spy(),
            }
            scenario.$.withArgs('<audio>').returns(audioStub);
            scenario.$.withArgs('<audio>');
            let oggStub = sinon.stub();
            scenario.$.withArgs('<source>', { src: 'bgm.ogg' }).returns(oggStub);
            let mp3Stub = sinon.stub();
            scenario.$.withArgs('<source>', { src: 'bgm.mp3' }).returns(mp3Stub);

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
            let audioStub = {
                remove: sinon.spy(),
            };
            audioStub[0] = {
                pause: sinon.spy(),
            }
            scenario.$.withArgs('#backgroundMusic').returns(audioStub);

            // act
            scenario.stopBgm({
                control: 'stop',
            });

            // assert
            assert(audioStub.remove.called);
            assert(audioStub[0].pause.called);
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

    describe('#disableUI()', function () {
        it('should off bindings', function () {
            // arrange
            let nextButtonStub = {
                off: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
            ).returns(nextButtonStub);
            let saveButtonStub = {
                off: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.save
            ).returns(saveButtonStub);
            let loadButtonStub = {
                off: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.load
            ).returns(loadButtonStub);

            // act
            scenario.disableUI();

            // assert
            assert(nextButtonStub.off.called);
            assert(saveButtonStub.off.called);
            assert(loadButtonStub.off.called);
        });
    });

    describe('#enableUI()', function () {
        it('should bind click on buttons', function () {
            // arrange
            let nextButtonMock = {
                click: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
            ).returns(nextButtonMock);
            let saveButtonMock = {
                click: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.save
            ).returns(saveButtonMock);
            let loadButtonMock = {
                click: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.load
            ).returns(loadButtonMock);

            // act
            scenario.enableUI();

            // assert
            assert(nextButtonMock.click.called);
            assert(saveButtonMock.click.called);
            assert(loadButtonMock.click.called);
        });
    });

    describe('#enableNextDirectionButton()', function () {
        it('should bind click on next button', function () {
            // arrange
            let nextButtonMock = {
                click: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
            ).returns(nextButtonMock);

            // act
            scenario.enableNextDirectionButton();

            // assert
            assert(nextButtonMock.click.called);
        });
    });

    describe('#changeButtonDuringDisplaying()', function () {
        it('should off and bind click on next button and the last letter element', function () {
            // arrange
            let nextButtonMock = {
                off: sinon.spy(),
                click: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
            ).returns(nextButtonMock);
            let letterElementMock = {
                one: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target + ' :last-child'
            ).returns(letterElementMock);

            // act
            scenario.changeButtonDuringDisplaying(false);

            // assert
            assert(nextButtonMock.off.called);
            assert(nextButtonMock.click.called);
            assert(letterElementMock.one.called);
        });
        it('should off click on next button and bind function on the last letter element', function () {
            // arrange
            let nextButtonMock = {
                off: sinon.spy(),
                click: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.ui.next
            ).returns(nextButtonMock);
            let letterElementMock = {
                one: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.message.target + ' :last-child'
            ).returns(letterElementMock);

            // act
            scenario.changeButtonDuringDisplaying(true);

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
            let imageStubFirst = {
                remove: sinon.spy(),
            };
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
            let backgroundImageStub = {
                remove: sinon.spy(),
            };
            scenario.$.withArgs(
                scenario.progress.displayConfig.background.target + ' .backgroundImage'
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
                displayConfig: {
                    message: {
                        target: '#messageWindow',
                        delay: 50,
                        duration: 500
                    },
                    background: {
                        target: '#backgroundWindow',
                        duration: 1000
                    },
                    image: {
                        duration: 1000
                    },
                    ui: {
                        next: '#nextButton',
                        save: '#saveButton',
                        load: '#loadButton',
                    }
                }, images: {
                    abc: {
                        name: 'abc',
                        source: 'abc.png',
                        x: 10,
                        y: 10,
                        z: -2,
                    }
                },
                bgmConfig: {
                    sources: ['abc.mp3'],
                    loop: true,
                    head: 0,
                },
                backgroundUrl: 'abc.jpg',
                scenarioUrl: 'abc.yml',
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
