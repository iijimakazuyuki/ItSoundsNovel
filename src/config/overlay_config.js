/**
 * @module OverlayConfig
 */

const Config = require('./config.js');

class OverlayConfig extends Config {
    /**
     * @param {{target: string, duration: number, timingFunction: string}} config
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
         * The duration (milliseconds) of displaying a overlay.
         * @type {number}
         */
        this.duration = config.duration;
        /**
         * The timing function of transition of a overlay.
         * @type {string}
         */
        this.timingFunction = config.timingFunction;
    }
    /**
     * Update properties with given instance's properties.
     * @param {OverlayConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        this.target = config.target || this.target;
        this.duration = config.duration || this.duration;
        this.timingFunction = config.timingFunction || this.timingFunction;
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        if (!this.isDefined) return new OverlayConfig();
        return new OverlayConfig({
            target: this.target,
            duration: this.duration,
            timingFunction: this.timingFunction,
        });
    }
    static defaultValue() {
        return DEFAULT;
    }
}

const DEFAULT = new OverlayConfig({
    target: '#backgroundWindow',
    duration: 1000,
    timingFunction: 'linear',
});

module.exports = OverlayConfig;
