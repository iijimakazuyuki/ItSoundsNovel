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
        if (image.x) this.x = image.x;
        if (image.y) this.y = image.y;
        if (image.z) this.z = image.z;
        if (image.scaleX) this.scaleX = image.scaleX;
        if (image.scaleY) this.scaleY = image.scaleY;
    }
    /**
     * @param {Image} image
     */
    update(image) {
        if (image.x) this.x = image.x;
        if (image.y) this.y = image.y;
        if (image.z) this.z = image.z;
        if (image.scaleX) this.scaleX = image.scaleX;
        if (image.scaleY) this.scaleY = image.scaleY;
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
    default() {
        if (!this.z) this.z = Image.defaultZ();
        if (!this.scaleX) this.scaleX = Image.defaultScaleX();
        if (!this.scaleY) this.scaleY = Image.defaultScaleY();
    }
}

const DEFAULT_Z = -1;
const DEFAULT_SCALE_X = 1.0;
const DEFAULT_SCALE_Y = 1.0;

module.exports = Image;
