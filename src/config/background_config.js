/**
 * @module BackgroundConfig
 */

const Config = require('./config.js');

class BackgroundConfig extends Config {
    /**
     * @param {{target: string, duration :number, timingFunction: string}} config
     */
    constructor(config) {
        super(config);
        if (!config) return;
        this.isDefined = true;
        /**
         * The id of the background window.
         * @type {string}
         */
        this.target = config.target;
        /**
         * The duration (milliseconds) of displaying a background.
         * @type {number}
         */
        this.duration = config.duration;
        /**
         * The timing function of transition of displaying background.
         * @type {string}
         */
        this.timingFunction = config.timingFunction;
    }
    /**
     * Update properties with given instance's properties.
     * @param {BackgroundConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        /**
         * @type {string}
         */
        this.target = config.target || this.target;
        /**
         * @type {number}
         */
        this.duration = config.duration || this.duratino;
        /**
         * @type {string}
         */
        this.timingFunction = config.timingFunction || this.timingFunction;
    }
    /**
     * Returns a copy of this.
     * @returns {BackgroundConfig}
     */
    copy() {
        if (!this.isDefined) return new BackgroundConfig();
        return new BackgroundConfig({
            target: this.target,
            duration: this.duration,
            timingFunction: this.timingFunction,
        });
    }
    static defaultValue() {
        return DEFAULT;
    }
}

const DEFAULT = new BackgroundConfig({
    target: '#backgroundWindow',
    duration: 1000,
    timingFunction: 'linear',
});

module.exports = BackgroundConfig;
