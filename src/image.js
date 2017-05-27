/**
 * @module Image
 */

class Image {
    /**
     * @param {{source: string, name: string, control: string, x: string|number, y: string|number, z: number, width: string|number, height: string|number, scaleX: number, scaleY: number, rotateX: string, rotateY: string, rotateZ: string}} image
     */
    constructor(image) {
        this.name = '';
        if (image.source) {
            this.source = image.source;
            this.name = image.source;
        }
        this.name = image.name || image.source || '';
        this.control = image.control;
        this.x = normalizePosition(image.x);
        this.y = normalizePosition(image.y);
        this.z = image.z;
        this.width = normalizePosition(image.width);
        this.height = normalizePosition(image.height);
        this.scaleX = image.scaleX;
        this.scaleY = image.scaleY;
        this.rotateX = image.rotateX;
        this.rotateY = image.rotateY;
        this.rotateZ = image.rotateZ;
    }
    /**
     * Update properties with given instance's properties.
     * @param {Image} image
     */
    update(image) {
        /**
         * @type {string}
         */
        this.x = image.x || this.x;
        /**
         * @type {string}
         */
        this.y = image.y || this.y;
        /**
         * @type {number}
         */
        this.z = image.z || this.z;
        /**
         * @type {string}
         */
        this.width = image.width || this.width;
        /**
         * @type {string}
         */
        this.height = image.height || this.height;
        /**
         * @type {number}
         */
        this.scaleX = image.scaleX || this.scaleX;
        /**
         * @type {number}
         */
        this.scaleY = image.scaleY || this.scaleY;
        /**
         * @type {string}
         */
        this.rotateX = image.rotateX || this.rotateX;
        /**
         * @type {string}
         */
        this.rotateY = image.rotateY || this.rotateY;
        /**
         * @type {string}
         */
        this.rotateZ = image.rotateZ || this.rotateZ;
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        return new Image({
            name: this.name,
            source: this.source,
            control: this.control,
            x: this.x,
            y: this.y,
            z: this.z,
            width: this.width,
            height: this.height,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            rotateX: this.rotateX,
            rotateY: this.rotateY,
            rotateZ: this.rotateZ,
        });
    }
    /**
     * Returns a default value of width.
     */
    static defaultWidth() {
        return DEFAULT_WIDTH;
    }
    /**
     * Returns a default value of height.
     */
    static defaultHeight() {
        return DEFAULT_HEIGHT;
    }
    /**
     * Returns a default value of z-index.
     */
    static defaultZ() {
        return DEFAULT_Z;
    }
    /**
     * Returns a default value of scaleX.
     */
    static defaultScaleX() {
        return DEFAULT_SCALE_X;
    }
    /**
     * Returns a default value of scaleY.
     */
    static defaultScaleY() {
        return DEFAULT_SCALE_Y;
    }
    /**
     * Returns a default value of rotateX.
     */
    static defaultRotateX() {
        return DEFAULT_ROTATE_X;
    }
    /**
     * Returns a default value of rotateY.
     */
    static defaultRotateY() {
        return DEFAULT_ROTATE_Y;
    }
    /**
     * Returns a default value of rotateZ.
     */
    static defaultRotateZ() {
        return DEFAULT_ROTATE_Z;
    }
    /**
     * Set undefined properties to default values.
     */
    default() {
        if (!this.width) this.width = Image.defaultWidth();
        if (!this.height) this.height = Image.defaultHeight();
        if (!this.z) this.z = Image.defaultZ();
        if (!this.scaleX) this.scaleX = Image.defaultScaleX();
        if (!this.scaleY) this.scaleY = Image.defaultScaleY();
        if (!this.rotateX) this.rotateX = Image.defaultRotateX();
        if (!this.rotateY) this.rotateY = Image.defaultRotateY();
        if (!this.rotateZ) this.rotateZ = Image.defaultRotateZ();
    }
}

/**
 * @param {number|string} x
 */
const normalizePosition = x => {
    if (isFinite(x)) if (x !== 0) return x + 'px';
    return String(x);
};

/**
 * The default value of width.
 */
const DEFAULT_WIDTH = 'auto';
/**
 * The default value of height.
 */
const DEFAULT_HEIGHT = 'auto';
/**
 * The default value of z-index.
 */
const DEFAULT_Z = -1;
/**
 * The default value of scaleX.
 */
const DEFAULT_SCALE_X = 1.0;
/**
 * The default value of scaleY.
 */
const DEFAULT_SCALE_Y = 1.0;
/**
 * The default value of rotateX.
 */
const DEFAULT_ROTATE_X = '0deg';
/**
 * The default value of rotateY.
 */
const DEFAULT_ROTATE_Y = '0deg';
/**
 * The default value of rotateZ.
 */
const DEFAULT_ROTATE_Z = '0deg';

module.exports = Image;
