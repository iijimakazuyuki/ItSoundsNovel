/**
 * @module scenario
 */

const yaml = require('js-yaml');
const $ = require('jquery');
const ScenarioProgress = require('./scenario_progress.js');
const Direction = require('./direction.js');
const Image = require('./image.js');
const BgmConfig = require('./bgm_config.js');

const BACKGROUND_IMAGE_DEFAULT_Z = -1000;

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
        let direction = this.directions[n];
        if (!direction) return;
        let config;
        if (direction.config) {
            config = this.progress.displayConfig.copy();
            config.update(direction.config);
        } else {
            config = this.progress.displayConfig;
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
            } else {
                this.displayBackground(direction.background.image, config);
            }
            if (direction.next === 'wait') {
                this.disableUI();
                this.waitForBackground(config);
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
        if (!direction.message) {
            this.progress.displayConfig.update(direction.config);
            this.display(++this.progress.pos);
            return;
        }
        this.displayMessage(direction.message, config);
        this.changeButtonDuringDisplaying(direction.next === 'wait');
    }

    /**
     * Display a background image.
     * @param {string} url The url of the background image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayBackground(url, config = this.progress.displayConfig) {
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
        }).on('load', () => {
            image.css({
                opacity: 1,
            });
        }).on('transitionend', () => {
            previousImage.remove();
        });
        this.$(config.background.target).append(image);
        this.progress.backgroundUrl = url;
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
        this.progress.backgroundUrl = null;
    }

    /**
     * Display an image.
     * @param {Image} image The image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayImage(image, config = this.progress.displayConfig) {
        let existingImage = this.$('#' + image.name);
        let transform = 'translate(' + image.x + 'px,' + image.y + 'px)';
        if (existingImage.length === 0) {
            if (!image.z) image.z = Image.defaultZ();
            let imageElement = this.$('<img>', {
                id: image.name,
                src: image.source,
            }).css({
                position: 'absolute',
                transform: transform,
                transition: config.image.duration / 1000 + 's',
                zIndex: image.z,
                opacity: 0,
            }).on('load', () => {
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
                newCss.transform = transform;
                if (image.z) newCss.zIndex = image.z;
                this.progress.images[image.name].update(image);
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
    waitForBackground(config = this.progress.displayConfig) {
        let imageElement =
            this.$(config.background.target + ' .backgroundImage.active');
        imageElement.one('transitionend', () => {
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
        this.$(this.progress.displayConfig.message.target).text('');
    }

    /**
     * Display a sentence.
     * @param {Message} message The message to display.
     * @param {DisplayConfig} config The display configuration.
     */
    displayMessage(message, config = this.progress.displayConfig) {
        let delayTime = 0;
        message.letters.forEach(c => {
            if (c.control) {
                if (c.key === 'duration') {
                    config.message.duration = Number(c.value);
                } else if (c.key === 'delay') {
                    config.message.delay = Number(c.value);
                }
            } else {
                this.appendLetterElement(c.value, delayTime, config)
                delayTime += config.message.delay;
            }
        });
    }

    /**
     * Display one letter in the sentence.
     * @param {string} letter The letter in the sentence.
     * @param {number} delayTime The delay time (seconds) of displaying the letter.
     * @param {DisplayConfig} config The display configuration.
     */
    appendLetterElement(letter, delayTime, config = this.progress.displayConfig) {
        if (letter === '\n') {
            this.$(config.message.target).append(this.$('<br />'));
            return;
        }
        let elementLetter = this.$('<span>' + letter + '</span>')
            .css({
                visibility: 'hidden',
                display: 'inline',
                transition: config.message.duration / 1000 + 's',
                opacity: 0,
            })
            .delay(delayTime)
            .queue(() => {
                elementLetter.css({
                    visibility: 'visible',
                    opacity: 1,
                });
            });
        this.$(config.message.target).append(elementLetter);
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
     */
    changeButtonDuringDisplaying(wait) {
        this.$(this.progress.displayConfig.ui.next).off('click');
        if (!wait) {
            this.$(this.progress.displayConfig.ui.next).click(() => {
                this.skipDisplayingLetters();
                this.enableNextDirectionButton();
            });
        }
        this.$(this.progress.displayConfig.message.target + ' :last-child')
            .one('transitionend', () => {
                if (!wait) {
                    this.$(this.progress.displayConfig.ui.next).off('click');
                }
                this.enableNextDirectionButton();
            });
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
        this.flush();
        this.stopBgm(new BgmConfig({ bgm: 'stop' }));
        this.removeImages();
        this.removeBackgroundImage();
        this.progress = new ScenarioProgress();
        this.progress.update(JSON.parse(this.window.localStorage.progress));
        this.$.get({
            url: this.progress.scenarioUrl,
            success: data => {
                this.directions = yaml
                    .safeLoad(data)
                    .map(direction => new Direction(direction));
                for (let key in this.progress.images) {
                    this.displayImage(this.progress.images[key]);
                }
                if (this.progress.backgroundUrl) {
                    this.displayBackground(this.progress.backgroundUrl);
                }
                if (this.progress.bgmConfig) {
                    this.playBgm(this.progress.bgmConfig);
                }
                this.init(this.progress.pos);
            },
            dataType: 'text',
        });
    }
}

module.exports = Scenario;
