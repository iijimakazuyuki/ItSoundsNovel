/**
 * @module MessageBackgroundConfig
 */

const Config = require('./config.js');

class MessageBackgroundConfig extends Config {
    /**
     * @param {{color: string, duration: number, timingFunction: string}} config
     */
    constructor(config) {
        super();
        if (!config) return;
        this.isDefined = true;
        /**
         * The color of the message window.
         * @type {string}
         */
        this.color = config.color;
        /**
         * The duration (milliseconds) of changing style of the message window.
         * @type {number}
         */
        this.duration = config.duration;
        /**
         * The timing function of transition of changing style of the message
         * window.
         * @type {string}
         */
        this.timingFunction = config.timingFunction;
    }
    /**
     * Update properties with given instance's properties.
     * @param {MessageBackgroundConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        /**
         * @type {string}
         */
        this.color = config.color || this.color;
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
     * @returns {MessageBackgroundConfig}
     */
    copy() {
        if (!this.isDefined) return new MessageBackgroundConfig();
        return new MessageBackgroundConfig({
            color: this.color,
            duration: this.duration,
            timingFunction: this.timingFunction,
        });
    }
}

module.exports = MessageBackgroundConfig;
