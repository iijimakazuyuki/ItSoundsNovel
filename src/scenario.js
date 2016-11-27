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
 * Scenario for a sound novel.
 */
class Scenario {
    constructor() {
        /**
         * Position of the loading scenario.
         */
        this.pos = 0;

        /**
         * The sentences of the loading scenario.
         * @type {string[]}
         */
        this.sentences = [];

        /**
         * The display configuration of the loading scenario.
         */
        this.config = DEFAULT_DISPLAY_CONFIG;

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
                this.sentences = yaml.safeLoad(data);
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
        let sentence = this.sentences[n].split('');
        sentence.forEach((v, i) => this.appendLetterElement(v, i));
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
     */
    appendLetterElement(letter, index) {
        let elementLetter = this.$('<span>' + letter + '</span>')
            .delay(index * this.config.delay)
            .animate({
                opacity: 'toggle',
            }, {
                duration: this.config.duration,
                start: () => elementLetter.css('display', 'inline'),
            });
        this.$(this.config.target).append(elementLetter);
    }
}

module.exports = Scenario;
