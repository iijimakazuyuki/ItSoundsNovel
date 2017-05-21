/**
 * @module MessageBackgroundConfig
 */

const Config = require('./config.js');

class MessageBackgroundConfig extends Config {
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
    update(config) {
        if (!config.isDefined) return;
        this.color = config.color || this.color;
        this.duration = config.duration || this.duration;
        this.timingFunction = config.timingFunction || this.timingFunction;
    }
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
