/**
 * @module background
 */

class Background {
    constructor(image, color) {
        this.image = image;
        this.color = color;
    }
    update(background) {
        if (background.image) {
            this.image = background.image;
        }
        if (background.color) {
            this.color = background.color;
        }
    }
    copy() {
        return new Background(
            this.image,
            this.color
        );
    }
}

module.exports = Background;
