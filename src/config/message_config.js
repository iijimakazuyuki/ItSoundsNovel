/**
 * @module MessageConfig
 */

const Config = require('./config.js');
const MessageBackgroundConfig = require('./message_background_config.js');
const AreaConfig = require('./area_config.js');

class MessageConfig extends Config {
    /**
     * @param {{target: string, delay: number, duration: number, timingFunction: string, fontSize: string, fontStyle: string, fontWeight: string, fontFamily: string, color: string, background: {color: string, duration: number, timingFunction: string}, position: {x: string|number, y: string|number, width: string|number, height: string|number, scaleX: number, scaleY: number, rotateX: string, rotateY: string, rotateZ: string, duration: number, timingFunction: string}}} config
     */
    constructor(config) {
        super();
        if (!config) return;
        this.isDefined = true;
        /**
         * The id of the message window.
         * @type {string}
         */
        this.target = config.target;
        /**
         * The delay time (milliseconds) to display each letter.
         * @type {number}
         */
        this.delay = config.delay;
        /**
         * The duration (milliseconds) to display a letter.
         * @type {number}
         */
        this.duration = config.duration;
        /**
         * The timing function of transition of displaying a letter.
         * @type {string}
         */
        this.timingFunction = config.timingFunction;
        /**
         * The font size.
         * @type {string}
         */
        this.fontSize = config.fontSize;
        /**
         * The font style.
         * @type {string}
         */
        this.fontStyle = config.fontStyle;
        /**
         * The font weight.
         * @type {string}
         */
        this.fontWeight = config.fontWeight;
        /**
         * The font family.
         * @type {string}
         */
        this.fontFamily = config.fontFamily;
        /**
         * The color of letters.
         * @type {string}
         */
        this.color = config.color;
        /**
         * The configuration for background of the messege window.
         */
        this.background = new MessageBackgroundConfig(config.background);
        /**
         * The configuration for position of the message window.
         */
        this.position = new AreaConfig(config.position);
    }
    /**
     * Update properties with given instance's properties.
     * @param {MessageConfig} config
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
        this.delay = config.delay || this.delay;
        /**
         * @type {number}
         */
        this.duration = config.duration || this.duration;
        /**
         * @type {string}
         */
        this.timingFunction = config.timingFunction || this.timingFunction;
        /**
         * @type {string}
         */
        this.fontSize = config.fontSize || this.fontSize;
        /**
         * @type {string}
         */
        this.fontStyle = config.fontStyle || this.fontStyle;
        /**
         * @type {string}
         */
        this.fontWeight = config.fontWeight || this.fontWeight;
        /**
         * @type {string}
         */
        this.fontFamily = config.fontFamily || this.fontFamily;
        /**
         * @type {string}
         */
        this.color = config.color || this.color;
        this.background.update(config.background);
        this.position.update(config.position);
    }
    /**
     * Returns a copy of this.
     * @returns {MessageConfig}
     */
    copy() {
        if (!this.isDefined) return new MessageConfig();
        return new MessageConfig({
            target: this.target,
            delay: this.delay,
            duration: this.duration,
            timingFunction: this.timingFunction,
            fontSize: this.fontSize,
            fontStyle: this.fontStyle,
            fontWeight: this.fontWeight,
            fontFamily: this.fontFamily,
            color: this.color,
            background: this.background.copy(),
            position: this.position.copy(),
        });
    }
    static defaultValue() {
        return DEFAULT;
    }
}

const DEFAULT = new MessageConfig({
    target: '#messageWindow',
    delay: 50,
    duration: 500,
    timingFunction: 'linear',
    fontSize: 'medium',
    fontStyle: 'normal',
    fontWeight: 'normal',
    background: {
        color: 'transparent',
        duration: 1000,
        timingFunction: 'linear',
    },
    position: {
        x: 0,
        y: 0,
        width: 'auto',
        height: 'auto',
        scaleX: 1,
        scaleY: 1,
        rotateX: '0deg',
        rotateY: '0deg',
        rotateZ: '0deg',
        duration: 1000,
        timingFunction: 'linear',
    },
});

module.exports = MessageConfig;
