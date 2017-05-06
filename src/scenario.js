/**
 * @module scenario
 */

const yaml = require('js-yaml');
const $ = require('jquery');
const ScenarioProgress = require('./scenario_progress.js');
const Direction = require('./direction.js');
const Image = require('./image.js');
const BgmConfig = require('./bgm_config.js');
const Character = require('./character.js');
const Flag = require('./flag.js');

const BACKGROUND_IMAGE_DEFAULT_Z = -1000;
const OVERLAY_DEFAULT_Z = 1000;

/**
 * Scenario for a sound novel.
 */
class Scenario {
    /**
     * @param {Window} window The window of the web browser.
     */
    constructor(window = null) {
        /**
         * The directions of the loading scenario.
         * @type {Direction[]}
         */
        this.directions = [];

        /**
         * JQuery.
         */
        this.$ = $;

        /**
         * The progress of the loading scenario.
         */
        this.progress = new ScenarioProgress();

        /**
         * True if a displayed message is flushed when the next button is clicked.
         */
        this.willFlush = true;

        /**
         * If a displayed message is not flushed,
         * this string will be appended the head of the next sentence.
         */
        this.concat = '';

        if (window) {
            /**
             * The window of the web browser.
             * @type {Window}
             */
            this.window = window;
        }
    }

    /**
     * Load a scenario from a url.
     * @param {string} url The url of the scenario.
     * @param {boolean} autoStart True if scenario starts automatically.
     */
    load(url, autoStart = true) {
        this.progress.scenarioUrl = url;
        this.$.get({
            url: url,
            success: data => {
                this.directions = yaml
                    .safeLoad(data)
                    .map(direction => new Direction(direction));
                if (autoStart) {
                    this.init(0);
                } else {
                    this.progress.pos = -1;
                    this.enableUI();
                }

            },
            dataType: 'text',
        });
    }

    /**
     * Initialize the scenario view.
     */
    init(pos) {
        this.progress.pos = pos;
        this.enableUI();
        this.display(pos);
    }

    /**
     * Display the sentence.
     * @param {number} n Position of the sentence.
     */
    display(n) {
        clearTimeout(this.autoDisplay);
        let direction = this.directions[n];
        if (!direction) return;
        if (direction.if) {
            let condition = direction.if.reduce((ret, entry) =>
                ret && this.progress.status[entry.name].value === entry.value
                , true);
            if (!condition) {
                this.display(++this.progress.pos);
                return;
            }
        }
        let config;
        if (direction.config) {
            config = this.progress.displayConfig.copy();
            config.update(direction.config);
        } else {
            config = this.progress.displayConfig.copy();
        }
        if (direction.wait) {
            this.waitForSeconds(direction.wait);
            return;
        }
        if (direction.load) {
            this.disableUI();
            this.load(direction.load);
            return;
        }
        if (direction.button) {
            this.displayButtons(direction.button);
            return;
        }
        if (direction.image) {
            this.displayImage(direction.image, config);
            if (direction.next === 'wait') {
                this.disableUI();
                this.waitForImage(direction.image);
            } else {
                this.display(++this.progress.pos);
            }
            return;
        }
        if (direction.bgm) {
            if (direction.bgm.control === 'stop') {
                this.stopBgm(direction.bgm);
            } else {
                this.playBgm(direction.bgm);
            }
            this.display(++this.progress.pos);
            return;
        }
        if (direction.background) {
            if (direction.background.control === 'remove') {
                this.removeBackground(config);
                if (direction.next === 'wait') {
                    this.disableUI();
                    this.waitForBackgroundImage(config);
                } else {
                    this.display(++this.progress.pos);
                }
                return;
            }
            if (direction.background.image) {
                this.displayBackgroundImage(direction.background.image, config);
                if (direction.next === 'wait') {
                    this.disableUI();
                    this.waitForBackgroundImage(config);
                } else {
                    this.display(++this.progress.pos);
                }
                return;
            }
            if (direction.background.color) {
                this.changeBackgroundColor(direction.background.color, config);
                this.removeBackground(config);
                if (direction.next === 'wait') {
                    this.disableUI();
                    this.waitForBackgroundColor(config);
                } else {
                    this.display(++this.progress.pos);
                }
                return;
            }
            return;
        }
        if (direction.overlay) {
            this.displayOverlay(direction.overlay, config);
            if (direction.next === 'wait') {
                this.disableUI();
                this.waitForOverlay(config);
            } else {
                this.display(++this.progress.pos);
            }
            return;
        }
        if (direction.sound) {
            if (direction.sound.control === 'stop') {
                this.stopSound();
            } else {
                this.playSound(direction.sound);
            }
            this.display(++this.progress.pos);
            return;
        }
        if (direction.status) {
            let flag = new Flag(direction.status.value, direction.status.display);
            if (direction.status.value) {
                this.progress.status[direction.status.name] = flag;
            }
            if (direction.status.display) {
                this.displayStatusMessage(
                    direction.status.name,
                    direction.status.display,
                    config
                );
            }
            this.display(++this.progress.pos);
            return;
        }
        if (!direction.message) {
            this.progress.displayConfig.update(direction.config);
            if (direction.config.message.background) {
                this.changeMessageWindowColor();
                if (direction.next === 'wait') {
                    this.disableUI();
                    this.waitForChangingMessageWindowColor();
                    return;
                }
            }
            if (direction.config.message.position) {
                this.moveMessageWindow();
                if (direction.next === 'wait') {
                    this.disableUI();
                    this.waitForMovingMessageWindow();
                }
            }
            this.display(++this.progress.pos);
            return;
        }
        if (this.concat) {
            direction.message.letters.unshift(new Character(null, null, this.concat));
            this.concat = '';
        }
        if (direction.concat) {
            this.concat = direction.concat;
        }
        if (direction.flush) {
            this.willFlush = direction.flush !== 'none';
        }
        this.displayMessage(direction.message, config);
        this.changeButtonDuringDisplaying(direction.next === 'wait', direction.auto);
    }

    /**
     * Display a background image.
     * @param {string} url The url of the background image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayBackgroundImage(url, config = this.progress.displayConfig) {
        let previousImage =
            this.$(config.background.target + ' .backgroundImage');
        previousImage.removeClass('active');
        let image = this.$('<img>', {
            src: url,
            class: 'backgroundImage active',
        }).css({
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: BACKGROUND_IMAGE_DEFAULT_Z,
            transition: config.background.duration / 1000 + 's',
            opacity: 0,
        }).delay(100).queue(() => {
            image.css({
                opacity: 1,
            }).on('transitionend', () => {
                previousImage.remove();
                this.resetBackgroundColor();
            });
        });
        this.$(config.background.target).append(image);
        this.progress.background.image = url;
    }

    /**
     * Reset background color.
     */
    resetBackgroundColor() {
        let config = this.progress.displayConfig.copy();
        config.update({ background: { duration: 0 } });
        this.changeBackgroundColor('transparent', config);
    }

    /**
     * Change background color.
     * @param {string} color The background color.
     * @param {DisplayConfig} config The display configuration.
     */
    changeBackgroundColor(color, config = this.progress.displayConfig) {
        let background = this.$(config.background.target + ' .backgroundColor');
        if (background.length === 0) {
            background = this.$('<div>',
                { class: 'backgroundColor' }
            ).css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                zIndex: BACKGROUND_IMAGE_DEFAULT_Z,
            });
            this.$(config.background.target).append(background);
        }
        background.delay(100).queue(function (next) {
            background.css({
                backgroundColor: color,
                transition: config.background.duration / 1000 + 's',
            });
            next();
        });
        this.progress.background.color = color;
    }

    /**
     * Display an overlay.
     * @param {Overlay} overlay The overlay.
     * @param {DisplayConfig} config The display configuration.
     */
    displayOverlay(overlay, config = this.progress.displayConfig) {
        let overlayElement = this.$(config.overlay.target + ' .overlay');
        if (overlayElement.length === 0) {
            overlayElement = this.$('<div>',
                { class: 'overlay' }
            ).css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: OVERLAY_DEFAULT_Z,
                backgroundColor: 'transparent',
                pointerEvents: 'none',
                opacity: 1,
            });
            this.$(config.overlay.target).append(overlayElement);
        }
        overlayElement.delay(100).queue(function (next) {
            overlayElement.css({
                backgroundColor: overlay.color,
                opacity: overlay.opacity,
                transition: config.overlay.duration / 1000 + 's',
            });
            next();
        });
        this.progress.overlay = overlay;
    }

    /**
     * Remove an overlay.
     */
    removeOverlay() {
        let config = this.progress.displayConfig.copy();
        config.update({ overlay: { duration: 0 } });
        this.displayOverlay('transparent', config);
    }

    /**
     * Change message window color.
     * @param {DisplayConfig} config The display configuration.
     */
    changeMessageWindowColor(config = this.progress.displayConfig) {
        let messageWindow = this.$(config.message.target);
        messageWindow.css({
            backgroundColor: config.message.background.color,
            transition: config.message.background.duration / 1000 + 's',
        });
    }

    /**
     * Move a message window.
     * @param {DisplayConfig} config The display configuration.
     */
    moveMessageWindow(config = this.progress.displayConfig) {
        let messageWindow = this.$(config.message.target);
        messageWindow.css({
            transform: TRANSFORM_OF(config.message.position),
            transition: config.message.position.duration / 1000 + 's',
        });
    }

    /**
     * Display a button.
     * @param {Button[]} buttons The buttons to display.
     */
    displayButtons(buttons) {
        buttons.forEach(button => {
            let buttonElement = this.$('#' + button.name);
            buttonElement.text(button.message)
                .show()
                .click(() => {
                    button.status.forEach(entry => {
                        this.progress.status[entry.name] = new Flag(entry.value, entry.display);
                        if (entry.display) {
                            this.displayStatusMessage(entry.name, entry.display);
                        }
                    });
                    buttons.forEach(b => {
                        this.$('#' + b.name).hide().off('click');
                    });
                    this.flush();
                    this.display(++this.progress.pos);
                });
        });
    }

    /**
     * Remove a background image.
     * @param {DisplayConfig} config The display configuration.
     */
    removeBackground(config = this.progress.displayConfig) {
        let previousImage =
            this.$(config.background.target + ' .backgroundImage.active');
        previousImage.css({
            transition: config.background.duration / 1000 + 's',
            opacity: 0,
        }).on('transitionend', () => {
            previousImage.remove();
        });
        this.progress.background.image = null;
    }

    /**
     * Display an image.
     * @param {Image} image The image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayImage(image, config = this.progress.displayConfig) {
        let existingImage = this.$('#' + image.name);
        if (existingImage.length === 0) {
            image.default();
            let transform = TRANSFORM_OF(image);
            let imageElement = this.$('<img>', {
                id: image.name,
                src: image.source,
            }).css({
                position: 'absolute',
                top: 0,
                left: 0,
                transform: transform,
                transition: config.image.duration / 1000 + 's',
                zIndex: image.z,
                opacity: 0,
            }).delay(100).queue(() => {
                imageElement.css({
                    opacity: 1,
                });
            });
            this.$(config.background.target).append(imageElement);
            this.progress.images[image.name] = image;
        } else {
            let newCss = {
                transition: config.image.duration / 1000 + 's',
            };
            if (image.control === 'remove') {
                delete this.progress.images[image.name];
                newCss.opacity = 0;
                existingImage.on('transitionend', () => {
                    existingImage.remove();
                });
            } else {
                let prevImage = this.progress.images[image.name];
                prevImage.update(image);
                newCss.transform = TRANSFORM_OF(prevImage);
                newCss.zIndex = prevImage.z;
            }
            existingImage.css(newCss);
        }
    }
    /**
     * Wait for displaying or moving image.
     * @param {Image} image The image.
     */
    waitForImage(image) {
        let imageElement = this.$('#' + image.name);
        imageElement.one('transitionend', () => {
            this.enableUI();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for displaying background image.
     * @param {DisplayConfig} config The display configuration.
     */
    waitForBackgroundImage(config = this.progress.displayConfig) {
        let imageElement =
            this.$(config.background.target + ' .backgroundImage.active');
        imageElement.one('transitionend', () => {
            this.enableUI();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for changing background color.
     * @param {DisplayConfig} config The display configuration.
     */
    waitForBackgroundColor(config = this.progress.displayConfig) {
        let backgroundElement = this.$(config.background.target + ' .backgroundColor');
        backgroundElement.one('transitionend', () => {
            this.enableUI();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for displaying an overlay.
     * @param {DisplayConfig} config The display configuration.
     */
    waitForOverlay(config = this.progress.displayConfig) {
        let overlayElement = this.$(config.overlay.target + ' .overlay');
        overlayElement.one('transitionend', () => {
            this.enableUI();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for changing message window color.
     * @param {DisplayConfig} config The display configuration.
     */
    waitForChangingMessageWindowColor(config = this.progress.displayConfig) {
        let messageWindow = this.$(config.message.target);
        messageWindow.one('transitionend', () => {
            this.enableUI();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for moving a message window.
     * @param {DisplayConfig} config The display configuration.
     */
    waitForMovingMessageWindow(config = this.progress.displayConfig) {
        let messageWindow = this.$(config.message.target);
        messageWindow.one('transitionend', () => {
            this.enableUI();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for seconds
     * @param {number} seconds The waiting seconds.
     */
    waitForSeconds(seconds) {
        this.$(this.progress.displayConfig.ui.next).off('click');
        setTimeout(() => {
            this.enableNextDirectionButton();
            this.display(++this.progress.pos);
        }, seconds);
    }

    /**
     * Flush the displayed sentence.
     */
    flush() {
        if (this.willFlush) {
            this.$(this.progress.displayConfig.message.target).text('');
        } else {
            this.willFlush = true;
        }
    }

    /**
     * Display a sentence.
     * @param {Message} message The message to display.
     * @param {DisplayConfig} config The display configuration.
     */
    displayMessage(message, config = this.progress.displayConfig) {
        let delayTime = 0;
        message.letters.forEach(c => {
            if (c.isKeyValue()) {
                if (c.key === 'duration') {
                    config.message.duration = Number(c.value);
                } else if (c.key === 'delay') {
                    config.message.delay = Number(c.value);
                } else if (c.key === 'fontSize') {
                    config.message.fontSize = c.value;
                } else if (c.key === 'fontStyle') {
                    config.message.fontStyle = c.value;
                } else if (c.key === 'fontFamily') {
                    config.message.fontFamily = c.value;
                } else if (c.key === 'fontWeight') {
                    config.message.fontWeight = c.value;
                } else if (c.key === 'color') {
                    config.message.color = c.value;
                }
            } else if (c.isHyperlink()) {
                let hyperlink = this.$('<a>', { href: c.value });
                c.key.split('').forEach(letter => {
                    let elementLetter = this.createLetterElement(letter, delayTime, config);
                    hyperlink.append(elementLetter);
                    delayTime += config.message.delay;
                });
                this.$(config.message.target).append(hyperlink);
            } else if (c.isSleep()) {
                delayTime += Number(c.value);
            } else {
                let elementLetter = this.createLetterElement(c.value, delayTime, config);
                this.$(config.message.target).append(elementLetter);
                delayTime += config.message.delay;
            }
        });
    }

    /**
     * Create one letter in the sentence.
     * @param {string} letter The letter in the sentence.
     * @param {number} delayTime The delay time (seconds) of displaying the letter.
     * @param {DisplayConfig} config The display configuration.
     */
    createLetterElement(letter, delayTime, config = this.progress.displayConfig) {
        if (letter === '\n') {
            return this.$('<br />');
        }
        let elementLetter = this.$('<span>' + letter + '</span>')
            .css({
                visibility: 'hidden',
                display: 'inline',
                transition: config.message.duration / 1000 + 's',
                opacity: 0,
                fontSize: config.message.fontSize,
                fontStyle: config.message.fontStyle,
                fontFamily: config.message.fontFamily,
                fontWeight: config.message.fontWeight,
                color: config.message.color,
            })
            .delay(delayTime)
            .queue(() => {
                elementLetter.css({
                    visibility: 'visible',
                    opacity: 1,
                });
            });
        return elementLetter;
    }

    /**
     * Play background music.
     * @param {BgmConfig} config The background music configuration.
     */
    playBgm(config) {
        this.stopBgm(config);
        let audio = this.$('<audio>', {
            class: 'backgroundMusic',
        });
        let sources = config.sources.map(url =>
            this.$('<source>', {
                src: url,
            })
        );
        if (config.loop) {
            audio.on('ended', () => {
                audio[0].currentTime = config.head;
                audio[0].play();
            });
            this.progress.bgmConfig = config;
        }
        audio.append(sources);
        this.$('body').append(audio);
        audio[0].play();
    }

    /**
     * Stop background music.
     * @param {BgmConfig} config The background music configuration.
     */
    stopBgm(config) {
        this.progress.bgmConfig = null;
        let previousBgm = this.$('.backgroundMusic');
        if (previousBgm.length === 0) return;
        if (!config.duration || config.duration === 0) {
            previousBgm[0].pause();
            previousBgm.remove();
        } else {
            let startTime = new Date();
            let intervalId = setInterval(() => {
                let currentTime = new Date();
                let targetVolume = 1 - (currentTime - startTime) / config.duration;
                if (targetVolume <= 0) {
                    previousBgm[0].pause();
                    previousBgm.remove();
                    clearInterval(intervalId);
                } else {
                    previousBgm[0].volume = targetVolume;
                }
            }, 100);
        }
    }

    /**
     * Play a sound.
     * @param {Sound} sound The sound to play
     */
    playSound(sound) {
        let audio = this.$('<audio>', {
            class: 'sound',
        });

        let sources = sound.source.map(url =>
            this.$('<source>', {
                src: url,
            })
        );
        audio.on('ended', () => {
            audio.remove();
        });
        audio.append(sources);
        this.$('body').append(audio);
        audio[0].play();
    }

    /**
     * Stop playing a sound.
     */
    stopSound() {
        let audio = this.$('.sound');
        for (let i = 0; i < audio.length; i++) {
            audio[i].pause();
        }
        audio.remove();
    }

    /** Flush status messages.
     *
     */
    flushStatusMessage() {
        this.$(this.progress.displayConfig.status.target).text('');
    }

    /**
     * Display a status message.
     * @param {string} name The name of the flag.
     * @param {string} message The status message of the flag.
     * @param {DisplayConfig} config The display configuration.
     */
    displayStatusMessage(name, message, config = this.progress.displayConfig) {
        let existingMessage = this.$('#' + name);
        if (message !== 'none') {
            if (existingMessage.length === 0) {
                let statusMessage = this.$('<div>', { id: name, }).text(message);
                this.$(config.status.target).append(statusMessage);
            } else {
                existingMessage.text(message);
            }
        } else {
            if (existingMessage.length > 0) {
                existingMessage.text('');
            }
        }
    }

    /**
     * Disable the user interface.
     */
    disableUI() {
        this.$(this.progress.displayConfig.ui.next).off('click');
        this.$(this.progress.displayConfig.ui.load).off('click');
        this.$(this.progress.displayConfig.ui.save).off('click');
    }

    /**
     * Enable the user interface.
     */
    enableUI() {
        this.enableNextDirectionButton();
        this.$(this.progress.displayConfig.ui.save).click(() => {
            this.saveProgress();
        });
        this.$(this.progress.displayConfig.ui.load).click(() => {
            this.loadProgress();
        });
    }

    /**
     * Enable the next button to execute next direction.
      */
    enableNextDirectionButton() {
        this.$(this.progress.displayConfig.ui.next).click(() => {
            this.flush();
            this.display(++this.progress.pos);
        });
    }

    /**
      * Enable the next button to skip displaying.
      * @param {boolean} wait If the next button is disabled to wait for displaying.
      * @param {number} auto Time from the last letter displaying to next direction being executed.
      */
    changeButtonDuringDisplaying(wait, auto = null) {
        this.$(this.progress.displayConfig.ui.next).off('click');
        let transitionEnd;
        if (wait) {
            if (auto) {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next).off('click');
                    this.autoDisplay = setTimeout(() => {
                        this.enableNextDirectionButton();
                        this.flush();
                        this.display(++this.progress.pos);
                    }, auto);
                };
            } else {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next).off('click');
                    this.enableNextDirectionButton();
                };
            }
        } else {
            this.$(this.progress.displayConfig.ui.next).click(() => {
                this.skipDisplayingLetters();
                this.enableNextDirectionButton();
            });
            if (auto || auto === 0) {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next).off('click');
                    this.autoDisplay = setTimeout(() => {
                        this.enableNextDirectionButton();
                        this.flush();
                        this.display(++this.progress.pos);
                    }, auto);
                };

            } else {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next).off('click');
                    this.enableNextDirectionButton();
                };
            }
        }
        this.$(this.progress.displayConfig.message.target + ' :last')
            .one('transitionend', transitionEnd);
    }

    /**
     * Skip displaying letters.
     */
    skipDisplayingLetters() {
        let elementLetters = this.$(this.progress.displayConfig.message.target + ' span');
        elementLetters
            .clearQueue()
            .css({
                transition: '60s',
                opacity: 0,
            })
            .delay(100)
            .queue(function () {
                $(this).css({
                    transition: '0s',
                    visibility: 'visible',
                    opacity: 1,
                });
            });
    }

    /**
     * Save the progress to the local storage of the web browser.
     */
    saveProgress() {
        this.window.localStorage.progress = JSON.stringify(this.progress);
    }

    removeImages() {
        for (let key in this.progress.images) {
            this.$('#' + this.progress.images[key].name).remove();
        }
    }

    removeBackgroundImage() {
        this.$(this.progress.displayConfig.background.target + ' .backgroundImage').remove();
    }

    /**
     * Load the progress from the local storage of the web browser.
     */
    loadProgress() {
        this.disableUI();
        this.willFlush = true;
        this.flush();
        this.stopBgm(new BgmConfig({ bgm: 'stop' }));
        this.removeImages();
        this.removeBackgroundImage();
        this.resetBackgroundColor();
        this.removeOverlay();
        this.flushStatusMessage();
        this.progress = new ScenarioProgress();
        this.progress.update(JSON.parse(this.window.localStorage.progress));
        this.changeMessageWindowColor();
        this.moveMessageWindow();
        this.$.get({
            url: this.progress.scenarioUrl,
            success: data => {
                this.directions = yaml
                    .safeLoad(data)
                    .map(direction => new Direction(direction));
                for (let key in this.progress.images) {
                    this.displayImage(this.progress.images[key]);
                }
                if (this.progress.background) {
                    if (this.progress.background.image) {
                        this.displayBackgroundImage(this.progress.background.image);
                    }
                    this.changeBackgroundColor(this.progress.background.color);
                }
                if (this.progress.bgmConfig) {
                    this.playBgm(this.progress.bgmConfig);
                }
                if (this.progress.overlay) {
                    this.displayOverlay(this.progress.overlay);
                }
                for (let key in this.progress.status) {
                    if (this.progress.status[key].display) {
                        this.displayStatusMessage(
                            key, this.progress.status[key].display
                        );
                    }
                }
                this.init(this.progress.pos);
            },
            dataType: 'text',
        });
    }
}

const TRANSFORM_OF = element =>
    [TRANSLATE_OF, SCALE_OF, ROTATE_OF].map(f => f(element)).join(' ');

const TRANSLATE_OF = element =>
    'translate(' + element.x + 'px,' + element.y + 'px)';

const SCALE_OF = element =>
    'scale(' + element.scaleX + ', ' + element.scaleY + ')';

const ROTATE_OF = element =>
    ' rotateX(' + element.rotateX + ')'
    + ' rotateY(' + element.rotateY + ')'
    + ' rotateZ(' + element.rotateZ + ')';

module.exports = Scenario;
