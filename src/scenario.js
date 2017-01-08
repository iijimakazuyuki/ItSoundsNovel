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
        if (config.background) this.background = config.background;
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
        if (config.background) this.background = config.background;
        if (config.image) this.image = config.image;
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
                delay: this.background.delay,
                duration: this.background.duration,
            },
            image: {
                duration: this.image.duration,
            },
            ui: {
                next: this.ui.next,
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
    }
}

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
        if (direction.background) this.background = direction.background;
        if (direction.config) this.config = new DisplayConfig(direction.config);
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
        if (direction.image) {
            this.image = new Image(direction.image);
        }
        if (direction.load) {
            this.load = direction.load;
        }
    }
}

/**
 * Scenario for a sound novel.
 */
class Scenario {
    constructor() {
        /**
         * Position of the loading scenario.
         */
        this.pos = 0;

        /**
         * The directions of the loading scenario.
         * @type {Direction[]}
         */
        this.directions = [];

        /**
         * The display configuration of the loading scenario.
         */
        this.config = DEFAULT_DISPLAY_CONFIG.copy();

        /**
         * JQuery.
         */
        this.$ = $;
    }

    /**
     * Load a scenario from a url.
     * @param {string} url The url of the scenario.
     */
    load(url) {
        this.$.get({
            url: url,
            success: data => {
                this.directions = yaml
                    .safeLoad(data)
                    .map(direction => new Direction(direction));
                this.init();
            },
            dataType: 'text',
        });
    }

    /**
     * Initialize the scenario view.
     */
    init() {
        this.pos = 0;
        this.display(0);
        this.$(this.config.ui.next).click(() => {
            this.flush();
            this.display(++this.pos);
        });
    }

    /**
     * Display the sentence.
     * @param {number} n Position of the sentence.
     */
    display(n) {
        let direction = this.directions[n];
        if (direction.load) {
            this.$(this.config.ui.next).off('click');
            this.load(direction.load);
            return;
        }
        if (direction.image) {
            this.displayImage(direction.image);
            this.display(++this.pos);
            return;
        }
        if (direction.bgm) {
            this.playBgm(direction.bgm);
            this.display(++this.pos);
            return;
        }
        if (direction.background) {
            this.displayBackground(direction.background.image);
            this.display(++this.pos);
            return;
        }
        if (direction.sound) {
            this.play(direction.sound);
            this.display(++this.pos);
            return;
        }
        if (!direction.message) {
            this.config.update(direction.config);
            this.display(++this.pos);
            return;
        }
        let sentence = direction.message.split('');
        let config;
        if (direction.config) {
            config = this.config.copy();
            config.update(direction.config);
        } else {
            config = this.config;
        }
        sentence.forEach(
            (v, i) => this.appendLetterElement(v, i, config)
        );
    }

    /**
     * Display a background image.
     * @param {string} url The url of the background image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayBackground(url, config = this.config) {
        let previousImage =
            this.$(config.background.target + ' .backgroundImage');
        let image = this.$('<img>', {
            src: url,
            class: 'backgroundImage',
        }).css({
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -2,
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
    }

    /**
     * Display an image.
     * @param {Image} image The image.
     * @param {DisplayConfig} config The display configuration.
     */
    displayImage(image, config = this.config) {
        let existingImage = this.$('#' + image.name);
        let transform = 'translate(' + image.x + 'px,' + image.y + 'px)';
        if (existingImage.length === 0) {
            let imageElement = this.$('<img>', {
                id: image.name,
                src: image.source,
            }).css({
                position: 'absolute',
                transform: transform,
                transition: config.image.duration / 1000 + 's',
                zIndex: -1,
                opacity: 0,
            }).on('load', () => {
                imageElement.css({
                    opacity: 1,
                });
            });
            this.$(config.background.target).append(imageElement);
        } else {
            if (image.control === 'remove') {
                existingImage.css({
                    opacity: 0,
                });
                existingImage.on('transitionend', () => {
                    existingImage.remove();
                });
                return;
            }
            existingImage.css({
                transform: transform,
            });
        }
    }

    /**
     * Flush the displayed sentence.
     */
    flush() {
        this.$(this.config.message.target).text('');
    }

    /**
     * Display one letter in the sentence.
     * @param {string} letter The letter in the sentence.
     * @param {number} index The index of the letter in the sentence.
     * @param {DisplayConfig} config The display configuration.
     */
    appendLetterElement(letter, index, config = this.config) {
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
}

module.exports = Scenario;
