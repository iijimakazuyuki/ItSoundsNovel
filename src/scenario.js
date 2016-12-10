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
        this.target = config.target;
        this.ui = config.ui;
        this.delay = config.delay;
        this.duration = config.duration;
    }
    update(config) {
        if (config.target) this.target = config.target;
        if (config.ui) this.ui = config.ui;
        if (config.delay) this.delay = config.delay;
        if (config.duration) this.duration = config.duration;
    }
    copy() {
        return new DisplayConfig({
            target: this.target,
            ui: {
                next: this.ui.next,
            },
            delay: this.delay,
            duration: this.duration,
        });
    }
}

/**
 * Default display configuration.
 */
const DEFAULT_DISPLAY_CONFIG = new DisplayConfig({
    target: '#messageWindow',
    ui: {
        next: '#nextButton',
    },
    delay: 50,
    duration: 500,
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
        if (direction.config) this.config = direction.config;
        if (direction.sound) {
            if (typeof direction.sound === 'string') {
                this.sound = [direction.sound];
            } else {
                this.sound = direction.sound;
            }
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
     * Flush the displayed sentence.
     */
    flush() {
        this.$(this.config.target).text('');
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
                display: 'none',
            })
            .delay(index * config.delay)
            .animate({
                opacity: 'toggle',
            }, {
                duration: config.duration,
                start: () => {
                    elementLetter.css('display', 'inline');
                },
            });
        this.$(config.target).append(elementLetter);
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
