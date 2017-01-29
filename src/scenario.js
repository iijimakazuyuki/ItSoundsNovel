/**
 * @module scenario
 */

const yaml = require('js-yaml');
const $ = require('jquery');

/**
 * Configuration for display scenarios.
 */
class DisplayConfig {
    constructor(config) {
        this.message = {};
        if (config.delay) this.message.delay = config.delay;
        if (config.duration) this.message.duration = config.duration;
        if (config.message) this.message = config.message;
        this.background = {};
        if (config.background) this.background = config.background;
        this.image = {};
        if (config.image) this.image = config.image;
        if (config.ui) this.ui = config.ui;
    }
    update(config) {
        if (config.delay) this.message.delay = config.delay;
        if (config.duration) this.message.duration = config.duration;
        if (config.message) {
            if (config.message.delay) {
                this.message.delay = config.message.delay;
            }
            if (config.message.duration) {
                this.message.duration = config.message.duration;
            }
        }
        if (config.background) {
            if (config.background.target) {
                this.background.target = config.background.target;
            }
            if (config.background.duration) {
                this.background.duration = config.background.duration;
            }
        }
        if (config.image) {
            if (config.image.duration) {
                this.image.duration = config.image.duration;
            }
        }
        if (config.ui) this.ui = config.ui;
    }
    copy() {
        return new DisplayConfig({
            message: {
                target: this.message.target,
                delay: this.message.delay,
                duration: this.message.duration,
            },
            background: {
                target: this.background.target,
                duration: this.background.duration,
            },
            image: {
                duration: this.image.duration,
            },
            ui: {
                next: this.ui.next,
                save: this.ui.save,
                load: this.ui.load,
            },
        });
    }
}

/**
 * Default loop configuration.
 */
const DEFAULT_LOOP_CONFIG = {
    loop: true,
    head: 0,
};

/**
 * Configuration for background music.
 */
class BgmConfig {
    constructor(bgm, loopConfig = DEFAULT_LOOP_CONFIG) {
        /**
         * The urls of background music.
         * @type{string[]}
         */
        this.sources = [];

        if (bgm === 'stop') {
            this.control = 'stop';
        } else if (typeof bgm === 'string') {
            this.sources = [bgm];
        } else {
            this.sources = bgm;
        }
        if (typeof loopConfig === 'string') {
            this.loop = loopConfig !== 'none';
        } else {
            if (loopConfig.loop) this.loop = loopConfig.loop;
            else this.loop = DEFAULT_LOOP_CONFIG.loop;
            if (loopConfig.head) this.head = loopConfig.head;
            else this.head = DEFAULT_LOOP_CONFIG.head;
        }
    }
}

class Image {
    constructor(image) {
        this.name = '';
        if (image.source) {
            this.source = image.source;
            this.name = image.source;
        }
        if (image.name) this.name = image.name;
        if (image.control) this.control = image.control;
        this.x = 0;
        if (image.x) this.x = image.x;
        this.y = 0;
        if (image.y) this.y = image.y;
        if (image.z) this.z = image.z;
    }
    /**
     * @param {Image} image
     */
    update(image) {
        if (image.x) this.x = image.x;
        if (image.y) this.y = image.y;
        if (image.z) this.z = image.z;
    }
}

const IMAGE_DEFAULT_Z = -1;
const BACKGROUND_IMAGE_DEFAULT_Z = -1000;

/**
 * Default display configuration.
 */
const DEFAULT_DISPLAY_CONFIG = new DisplayConfig({
    message: {
        target: '#messageWindow',
        delay: 50,
        duration: 500,
    },
    background: {
        target: '#backgroundWindow',
        duration: 1000,
    },
    image: {
        duration: 1000,
    },
    ui: {
        next: '#nextButton',
        save: '#saveButton',
        load: '#loadButton',
    },
});

/**
 * A direction of a scenario.
 */
class Direction {
    constructor(direction) {
        if (typeof direction === 'string' || typeof direction === 'number') {
            this.message = direction;
            return;
        }
        if (direction.message) this.message = direction.message;
        if (direction.background) {
            this.background = direction.background;
            if (direction.config) this.config = new DisplayConfig({ background: direction.config });
        } else if (direction.image) {
            this.image = new Image(direction.image);
            if (direction.config) this.config = new DisplayConfig({ image: direction.config });
        } else {
            if (direction.config) this.config = new DisplayConfig(direction.config);
        }
        if (direction.sound) {
            if (typeof direction.sound === 'string') {
                this.sound = [direction.sound];
            } else {
                this.sound = direction.sound;
            }
        }
        if (direction.bgm) {
            if (direction.loop) this.bgm = new BgmConfig(direction.bgm, direction.loop)
            else this.bgm = new BgmConfig(direction.bgm);
        }
        if (direction.load) {
            this.load = direction.load;
        }
        if (direction.next) {
            this.next = direction.next;
        }
    }
}

/**
 * The progress of the scenario.
 */
class ScenarioProgress {
    constructor() {
        /**
         * The position of the loading scenario.
         */
        this.pos = 0;

        /**
         * The url of the loading scenario.
         * @type {string}
         */
        this.scenarioUrl;

        /**
         * The display configuration of the loading scenario.
         * @type {DisplayConfig}
         */
        this.displayConfig = DEFAULT_DISPLAY_CONFIG.copy();

        /**
         * The displaying images.
         */
        this.images = {};

        /**
         * The configuration for background music.
         * @type {BgmConfig}
         */
        this.bgmConfig = null;

        /**
         * The url of the background image.
         * @type {string}
         */
        this.backgroundUrl = null;
    }
    update(progress) {
        if (progress.pos) this.pos = progress.pos;
        if (progress.scenarioUrl) this.scenarioUrl = progress.scenarioUrl;
        if (progress.displayConfig) this.displayConfig.update(progress.displayConfig);
        for (let key in progress.images) {
            this.images[key] = new Image(progress.images[key]);
        }
        if (progress.bgmConfig) {
            this.bgmConfig = new BgmConfig(
                progress.bgmConfig.sources,
                {
                    loop: progress.bgmConfig.loop,
                    head: progress.bgmConfig.head,
                }
            );
        }
        if (progress.backgroundUrl) this.backgroundUrl = progress.backgroundUrl;
    }
}

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
     */
    load(url) {
        this.progress.scenarioUrl = url;
        this.$.get({
            url: url,
            success: data => {
                this.directions = yaml
                    .safeLoad(data)
                    .map(direction => new Direction(direction));
                this.init(0);
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
            this.playBgm(direction.bgm);
            this.display(++this.progress.pos);
            return;
        }
        if (direction.background) {
            this.displayBackground(direction.background.image, config);
            if (direction.next === 'wait') {
                this.disableUI();
                this.waitForBackground(config);
            } else {
                this.display(++this.progress.pos);
            }
            return;
        }
        if (direction.sound) {
            this.play(direction.sound);
            this.display(++this.progress.pos);
            return;
        }
        if (!direction.message) {
            this.progress.displayConfig.update(direction.config);
            this.display(++this.progress.pos);
            return;
        }
        let sentence = direction.message.split('');
        sentence.forEach(
            (v, i) => this.appendLetterElement(v, i, config)
        );
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
     * Display an image.
     * @param {Image} image The image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayImage(image, config = this.progress.displayConfig) {
        let existingImage = this.$('#' + image.name);
        let transform = 'translate(' + image.x + 'px,' + image.y + 'px)';
        if (existingImage.length === 0) {
            if (!image.z) image.z = IMAGE_DEFAULT_Z;
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
     * Flush the displayed sentence.
     */
    flush() {
        this.$(this.progress.displayConfig.message.target).text('');
    }

    /**
     * Display one letter in the sentence.
     * @param {string} letter The letter in the sentence.
     * @param {number} index The index of the letter in the sentence.
     * @param {DisplayConfig} config The display configuration.
     */
    appendLetterElement(letter, index, config = this.progress.displayConfig) {
        let elementLetter = this.$('<span>' + letter + '</span>')
            .css({
                visibility: 'hidden',
                display: 'inline',
                transition: config.message.duration / 1000 + 's',
                opacity: 0,
            })
            .delay(index * config.message.delay)
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
        let previousBgm = this.$('#backgroundMusic');
        if (previousBgm.length > 0) {
            this.progress.bgmConfig = null;
            previousBgm[0].pause();
            previousBgm.remove();
        }
        if (config.control === 'stop') return;
        let audio = this.$('<audio>', {
            id: 'backgroundMusic',
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
     * Play a sound.
     * @param {string[]} urls The urls of the sound
     */
    play(urls) {
        let audio = this.$('<audio>');

        let sources = urls.map(url =>
            this.$('<source>', {
                src: url,
            })
        );
        audio.append(sources);
        audio[0].play();
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
        this.$(this.progress.displayConfig.ui.next).click(() => {
            this.flush();
            this.display(++this.progress.pos);
        });
        this.$(this.progress.displayConfig.ui.save).click(() => {
            this.saveProgress();
        });
        this.$(this.progress.displayConfig.ui.load).click(() => {
            this.loadProgress();
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
        this.playBgm(new BgmConfig('stop'));
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
