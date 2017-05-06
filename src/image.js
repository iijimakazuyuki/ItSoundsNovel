/**
 * @module Image
 */

class Image {
    constructor(image) {
        this.name = '';
        if (image.source) {
            this.source = image.source;
            this.name = image.source;
        }
        if (image.name) this.name = image.name;
        if (image.control) this.control = image.control;
        if (image.x || image.x === 0) this.x = NORMALIZE_POSITION(image.x);
        if (image.y || image.y === 0) this.y = NORMALIZE_POSITION(image.y);
        if (image.z || image.z === 0) this.z = image.z;
        if (image.width || image.width === 0) this.width = image.width;
        if (image.height || image.height === 0) this.height = image.height;
        if (image.scaleX) this.scaleX = image.scaleX;
        if (image.scaleY) this.scaleY = image.scaleY;
        if (image.rotateX) this.rotateX = image.rotateX;
        if (image.rotateY) this.rotateY = image.rotateY;
        if (image.rotateZ) this.rotateZ = image.rotateZ;
    }
    /**
     * @param {Image} image
     */
    update(image) {
        if (image.x || image.x === 0) this.x = image.x;
        if (image.y || image.y === 0) this.y = image.y;
        if (image.z || image.z === 0) this.z = image.z;
        if (image.width || image.width === 0) this.width = image.width;
        if (image.height || image.height === 0) this.height = image.height;
        if (image.scaleX) this.scaleX = image.scaleX;
        if (image.scaleY) this.scaleY = image.scaleY;
        if (image.rotateX) this.rotateX = image.rotateX;
        if (image.rotateY) this.rotateY = image.rotateY;
        if (image.rotateZ) this.rotateZ = image.rotateZ;
    }
    static defaultWidth() {
        return DEFAULT_WIDTH;
    }
    static defaultHeight() {
        return DEFAULT_HEIGHT;
    }
    static defaultZ() {
        return DEFAULT_Z;
    }
    static defaultScaleX() {
        return DEFAULT_SCALE_X;
    }
    static defaultScaleY() {
        return DEFAULT_SCALE_Y;
    }
    static defaultRotateX() {
        return DEFAULT_ROTATE_X;
    }
    static defaultRotateY() {
        return DEFAULT_ROTATE_Y;
    }
    static defaultRotateZ() {
        return DEFAULT_ROTATE_Z;
    }
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

const NORMALIZE_POSITION = x => {
    if (isFinite(x)) if (x !== 0) return x + 'px';
    return String(x);
};

const DEFAULT_WIDTH = 'auto';
const DEFAULT_HEIGHT = 'auto';
const DEFAULT_Z = -1;
const DEFAULT_SCALE_X = 1.0;
const DEFAULT_SCALE_Y = 1.0;
const DEFAULT_ROTATE_X = '0deg';
const DEFAULT_ROTATE_Y = '0deg';
const DEFAULT_ROTATE_Z = '0deg';

module.exports = Image;
