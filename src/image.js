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
        this.x = 0;
        if (image.x) this.x = image.x;
        this.y = 0;
        if (image.y) this.y = image.y;
        if (image.z) this.z = image.z;
    }
    /**
     * @param {Image} image
     */
    update(image) {
        if (image.x) this.x = image.x;
        if (image.y) this.y = image.y;
        if (image.z) this.z = image.z;
    }
    static defaultZ() {
        return DEFAULT_Z;
    }
}

const DEFAULT_Z = -1;

module.exports = Image;
