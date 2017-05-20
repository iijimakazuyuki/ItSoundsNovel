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
         * The progress to save.
         */
        this.progressToSave = null;

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
                    this.updateButtons();
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
        this.updateButtons();
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
            this.updateStatus(direction.status);
            if (direction.status.display) {
                this.displayStatusMessage(
                    this.progress.status[direction.status.name],
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
            this.updateButtons();
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
            if (!this.willFlush) this.progressToSave = this.progress.copy();
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
            transition: TRANSITION_OF(config.background),
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
                transition: TRANSITION_OF(config.background),
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
                transition: TRANSITION_OF(config.overlay),
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
            transition: TRANSITION_OF(config.message.background),
        });
    }

    /**
     * Move a message window.
     * @param {DisplayConfig} config The display configuration.
     */
    moveMessageWindow(config = this.progress.displayConfig) {
        let messageWindow = this.$(config.message.target);
        messageWindow.css({
            width: config.message.position.width,
            height: config.message.position.height,
            transform: TRANSFORM_OF(config.message.position),
            transition: TRANSITION_OF(config.message.position),
        });
    }

    /**
     * Display a button.
     * @param {Button[]} buttons The buttons to display.
     */
    displayButtons(buttons) {
        this.disableNextButton();
        buttons.forEach(button => {
            let buttonElement = this.$('#' + button.name);
            buttonElement.text(button.message)
                .show()
                .off('click')
                .click(() => {
                    button.status.forEach(entry => {
                        this.updateStatus(entry);
                        if (entry.display) {
                            this.displayStatusMessage(
                                this.progress.status[entry.name]
                            );
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
     * Update status.
     * @param {object} status The status to update.
     */
    updateStatus(status) {
        if (this.progress.status[status.name]) {
            this.progress.status[status.name].update(
                status,
                this.progress.status
            );
        } else {
            this.progress.status[status.name] = new Flag(
                status.name,
                status.value,
                status.display,
                status.target
            );
        }
    }

    /**
     * Enable, disable or hide the buttons.
     */
    updateButtons() {
        this.disableUI();
        if (this.progress.displayConfig.ui.next.status === 'invisible') {
            this.hideNextButton();
        } else if (this.progress.displayConfig.ui.next.status === 'available') {
            this.enableNextDirectionButton();
        }
        if (this.progress.displayConfig.ui.save.status === 'invisible') {
            this.hideSaveButton();
        } else if (this.progress.displayConfig.ui.save.status === 'available') {
            this.enableSaveButton();
        }
        if (this.progress.displayConfig.ui.load.status === 'invisible') {
            this.hideLoadButton();
        } else if (this.progress.displayConfig.ui.load.status === 'available') {
            this.enableLoadButton();
        }
    }


    /**
     * Remove a background image.
     * @param {DisplayConfig} config The display configuration.
     */
    removeBackground(config = this.progress.displayConfig) {
        let previousImage =
            this.$(config.background.target + ' .backgroundImage.active');
        previousImage.css({
            transition: TRANSITION_OF(config.background),
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
                width: image.width,
                height: image.height,
                transform: transform,
                transition: TRANSITION_OF(config.image),
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
                transition: TRANSITION_OF(config.image),
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
                newCss.width = prevImage.width;
                newCss.height = prevImage.height;
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
            this.updateButtons();
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
            this.updateButtons();
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
            this.updateButtons();
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
            this.updateButtons();
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
            this.updateButtons();
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
            this.updateButtons();
            this.display(++this.progress.pos);
        });
    }

    /**
     * Wait for seconds
     * @param {number} seconds The waiting seconds.
     */
    waitForSeconds(seconds) {
        this.$(this.progress.displayConfig.ui.next.target).off('click');
        setTimeout(() => {
            this.updateButtons();
            this.display(++this.progress.pos);
        }, seconds);
    }

    /**
     * Flush the displayed sentence.
     */
    flush() {
        if (this.willFlush) {
            this.progressToSave = null;
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
                } else if (c.key === 'timingFunction') {
                    config.message.timingFunction = c.value;
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
            } else if (c.isRuby()) {
                // If font size css is set to each element of ruby,
                // ruby might overwrap above sentences.
                // Therefore we set font size css to only ruby element
                // and we make a display configuration for ruby,
                // which does not have font size css.
                let ruby = this.$('<ruby>').css({
                    fontSize: config.message.fontSize,
                });
                let configForRuby = config.copy();
                configForRuby.message.fontSize = '';
                c.key.split('').forEach((letter, index) => {
                    let elementLetter = this.createLetterElement(
                        letter,
                        delayTime + config.message.delay * index,
                        configForRuby
                    );
                    ruby.append(elementLetter);
                });
                this.$('<rp>').append(this.createLetterElement(
                    '(',
                    delayTime,
                    configForRuby
                )).appendTo(ruby);
                let rt = this.$('<rt>');
                ruby.append(rt);
                c.value.split('').forEach((letter, index) => {
                    let elementLetter = this.createLetterElement(
                        letter,
                        delayTime + config.message.delay * c.key.length * index / c.value.length,
                        configForRuby
                    );
                    rt.append(elementLetter);
                });
                this.$('<rp>').append(this.createLetterElement(
                    ')',
                    delayTime + config.message.delay * c.key.length,
                    configForRuby
                )).appendTo(ruby);
                delayTime += config.message.delay * c.key.length;
                this.$(config.message.target).append(ruby);
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
                transition: TRANSITION_OF(config.message),
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
        for (let key in this.progress.status) {
            let flag = this.progress.status[key];
            if (flag.display) {
                this.$('#' + key).remove();
            }
        }
    }

    /**
     * Display a status message.
     * @param {Flag} flag The flag to display.
     * @param {DisplayConfig} config The display configuration.
     */
    displayStatusMessage(flag, config = this.progress.displayConfig) {
        let existingMessage = this.$('#' + flag.name);
        if (flag.display !== 'none') {
            let message = '';
            let controlCharacterRegex = /\${(.*?)}/g
            let index = 0;
            let resultArray;
            while ((resultArray = controlCharacterRegex.exec(flag.display))) {
                message += flag.display.slice(index, resultArray.index);
                if (resultArray[1] === 'value') {
                    message += flag.value;
                }
                index = controlCharacterRegex.lastIndex;
            }
            message += flag.display.slice(index);
            if (existingMessage.length === 0) {
                let statusMessage = this.$('<div>', { id: flag.name, }).text(message);
                if (flag.target) {
                    this.$(flag.target).append(statusMessage);
                } else {
                    this.$(config.status.target).append(statusMessage);
                }
            } else {
                existingMessage.text(message);
                let parentId = existingMessage.parent().attr('id');
                if (flag.target) {
                    if (parentId !== flag.target) {
                        existingMessage.detach().appendTo(this.$(flag.target));
                    }
                } else {
                    if (parentId !== config.status.target) {
                        existingMessage.detach().appendTo(this.$(config.status.target));
                    }
                }
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
        this.disableNextButton();
        this.disableSaveButton();
        this.disableLoadButton();
    }

    /**
     * Disable the next button.
     */
    disableNextButton() {
        this.$(this.progress.displayConfig.ui.next.target).off('click');
    }

    /**
     * Disable the save button.
     */
    disableSaveButton() {
        this.$(this.progress.displayConfig.ui.save.target).off('click');
    }

    /**
     * Disable the load button.
     */
    disableLoadButton() {
        this.$(this.progress.displayConfig.ui.load.target).off('click');
    }

    /**
     * Enable the next button to execute next direction.
      */
    enableNextDirectionButton() {
        this.$(this.progress.displayConfig.ui.next.target)
            .show()
            .click(() => {
                this.flush();
                this.display(++this.progress.pos);
            });
    }

    enableSkipButton() {
        this.$(this.progress.displayConfig.ui.next.target)
            .show()
            .click(() => {
                this.skipDisplayingLetters();
                this.updateButtons();
            });
    }

    /**
     * Enable the save button.
      */
    enableSaveButton() {
        this.$(this.progress.displayConfig.ui.save.target)
            .show()
            .click(() => {
                this.saveProgress();
            });
    }

    /**
     * Enable the load button.
      */
    enableLoadButton() {
        this.$(this.progress.displayConfig.ui.load.target)
            .show()
            .click(() => {
                this.loadProgress();
            });
    }

    /**
     * Hide the next button.
     */
    hideNextButton() {
        this.$(this.progress.displayConfig.ui.next.target).hide();
    }

    /**
     * Hide the save button.
     */
    hideSaveButton() {
        this.$(this.progress.displayConfig.ui.save.target).hide();
    }

    /**
     * Hide the load button.
     */
    hideLoadButton() {
        this.$(this.progress.displayConfig.ui.load.target).hide();
    }

    /**
      * Enable the next button to skip displaying.
      * @param {boolean} wait If the next button is disabled to wait for displaying.
      * @param {number} auto Time from the last letter displaying to next direction being executed.
      */
    changeButtonDuringDisplaying(wait, auto = null) {
        this.$(this.progress.displayConfig.ui.next.target).off('click');
        let transitionEnd;
        if (wait) {
            if (auto) {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next.target).off('click');
                    this.autoDisplay = setTimeout(() => {
                        this.updateButtons();
                        this.flush();
                        this.display(++this.progress.pos);
                    }, auto);
                };
            } else {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next.target).off('click');
                    this.updateButtons();
                };
            }
        } else {
            if (this.progress.displayConfig.ui.next.status === 'available') {
                this.enableSkipButton();
            }
            if (auto || auto === 0) {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next.target).off('click');
                    this.autoDisplay = setTimeout(() => {
                        this.updateButtons();
                        this.flush();
                        this.display(++this.progress.pos);
                    }, auto);
                };

            } else {
                transitionEnd = () => {
                    this.$(this.progress.displayConfig.ui.next.target).off('click');
                    this.updateButtons();
                };
            }
        }
        this.$(this.progress.displayConfig.message.target + ' > :last')
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
                transition: '0s',
                visibility: 'visible',
                opacity: 1,
            }).trigger('transitionend');
    }

    /**
     * Save the progress to the local storage of the web browser.
     */
    saveProgress() {
        if (this.progressToSave) {
            this.window.localStorage.progress = JSON.stringify(this.progressToSave);
        } else {
            this.window.localStorage.progress = JSON.stringify(this.progress);
        }
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
        this.updateButtons();
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
                    let flag = this.progress.status[key];
                    this.progress.status[key] = new Flag(
                        flag.name,
                        flag.value,
                        flag.display,
                        flag.target
                    );
                    if (this.progress.status[key].display) {
                        this.displayStatusMessage(this.progress.status[key]);
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
    'translate(' + element.x + ',' + element.y + ')';

const SCALE_OF = element =>
    'scale(' + element.scaleX + ', ' + element.scaleY + ')';

const ROTATE_OF = element =>
    ' rotateX(' + element.rotateX + ')'
    + ' rotateY(' + element.rotateY + ')'
    + ' rotateZ(' + element.rotateZ + ')';

const TRANSITION_OF = element =>
    element.duration / 1000 + 's ' + element.timingFunction;

module.exports = Scenario;
