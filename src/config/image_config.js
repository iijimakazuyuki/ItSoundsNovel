/**
 * @module ImageConfig
 */

const Config = require('./config.js');

class ImageConfig extends Config {
    /**
     * @param {{duration: number, timingFunction: string}} config
     */
    constructor(config) {
        super(config);
        if (!config) return;
        this.isDefined = true;
        /**
         * The duration (seconds) of displaying an image.
         * @type {number}
         */
        this.duration = config.duration;
        /**
         * The timing function of transition of an image.
         * @type {string}
         */
        this.timingFunction = config.timingFunction;
    }
    /**
     * Update properties with given instance's properties.
     * @param {ImageConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        /**
         * @type {number}
         */
        this.duration = config.duration || this.duration;
        /**
         * @type {string}
         */
        this.timingFunction = config.timingFunction || this.timingFunction;
    }
    /**
     * Returns a copy of this.
     * @returns {ImageConfig}
     */
    copy() {
        if (!this.isDefined) return new ImageConfig();
        return new ImageConfig({
            duration: this.duration,
            timingFunction: this.timingFunction,
        });
    }
    static defaultValue() {
        return DEFAULT;
    }
}

const DEFAULT = new ImageConfig({
    duration: 1000,
    timingFunction: 'linear',
});

module.exports = ImageConfig;
