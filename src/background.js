/**
 * @module background
 */

class Background {
    constructor(background) {
        this.image = background.image;
        this.color = background.color;
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
        return new Background({
            image: this.image,
            color: this.color,
        });
    }
}

module.exports = Background;
