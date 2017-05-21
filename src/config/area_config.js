/**
 * @module AreaConfig
 */

const Config = require('./config.js');

class AreaConfig extends Config {
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
    update(config) {
        if (!config.isDefined) return;
        this.x = config.x || this.x;
        this.y = config.y || this.y;
        this.width = config.width || this.width;
        this.height = config.height || this.height;
        this.scaleX = config.scaleX || this.scaleX;
        this.scaleY = config.scaleY || this.scaleY;
        this.rotateX = config.rotateX || this.rotateX;
        this.rotateY = config.rotateY || this.rotateY;
        this.rotateZ = config.rotateZ || this.rotateZ;
        this.duration = config.duration || this.duration;
        this.timingFunction = config.timingFunction || this.timingFunction;
    }
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

const normalizePosition = x => {
    if (isFinite(x) && x !== 0) return x + 'px';
    return String(x);
};

module.exports = AreaConfig;
