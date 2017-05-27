/**
 * @module AreaConfig
 */

const Config = require('./config.js');

class AreaConfig extends Config {
    /**
     * @param {{x: string|number, y: string|number, width: string|number, height: string|number, scaleX: number, scaleY: number, rotateX: string, rotateY: string, rotateZ: string, duration: number, timingFunction: string}} config
     */
    constructor(config) {
        super();
        if (!config) return;
        this.isDefined = true;
        /**
         * The x-coordinate of starting this area.
         * @type {string}
         */
        this.x = normalizePosition(config.x);
        /**
         * The y-coordinate of starting this area.
         * @type {string}
         */
        this.y = normalizePosition(config.y);
        /**
         * The width of this area.
         * @type {string}
         */
        this.width = String(config.width);
        /**
         * The height of this area.
         * @type {string}
         */
        this.height = String(config.height);
        /**
         * The scaling rate along x-axis of this area.
         * @type {string}
         */
        this.scaleX = config.scaleX;
        /**
         * The scaling rate along y-axis of this area.
         * @type {number}
         */
        this.scaleY = config.scaleY;
        /**
         * The degree of rotation around x-axis of this area.
         * @type {string}
         */
        this.rotateX = config.rotateX;
        /**
         * The degree of rotation around y-axis of this area.
         * @type {string}
         */
        this.rotateY = config.rotateY;
        /**
         * The degree of rotation around z-axis of this area.
         * @type {string}
         */
        this.rotateZ = config.rotateZ;
        /**
         * The duration (milliseconds) of transition of this area.
         */
        this.duration = config.duration;
        /**
         * The timing function of transition of this area.
         */
        this.timingFunction = config.timingFunction;
    }
    /**
     * Update properties with given instance's properties.
     * @param {AreaConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        /**
         * @type {string}
         */
        this.x = config.x || this.x;
        /**
         * @type {string}
         */
        this.y = config.y || this.y;
        /**
         * @type {string}
         */
        this.width = config.width || this.width;
        /**
         * @type {string}
         */
        this.height = config.height || this.height;
        /**
         * @type {number}
         */
        this.scaleX = config.scaleX || this.scaleX;
        /**
         * @type {number}
         */
        this.scaleY = config.scaleY || this.scaleY;
        /**
         * @type {string}
         */
        this.rotateX = config.rotateX || this.rotateX;
        /**
         * @type {string}
         */
        this.rotateY = config.rotateY || this.rotateY;
        /**
         * @type {string}
         */
        this.rotateZ = config.rotateZ || this.rotateZ;
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
     * @returns {AreaConfig}
     */
    copy() {
        if (!this.isDefined) return new AreaConfig();
        return new AreaConfig({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            rotateX: this.rotateX,
            rotateY: this.rotateY,
            rotateZ: this.rotateZ,
            duration: this.duration,
            timingFunction: this.timingFunction,
        });
    }
}

/**
 * @param {number|string} x
 */
const normalizePosition = x => {
    if (isFinite(x) && x !== 0) return x + 'px';
    return String(x);
};

module.exports = AreaConfig;
