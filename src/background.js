/**
 * @module background
 */

/**
 * Background.
 */
class Background {
    /**
     * @param {{image: string, color: string}} background
     */
    constructor(background) {
        this.image = background.image;
        this.color = background.color;
    }
    /**
     * Update properties with given instance's properties.
     * @param {Background} background
     */
    update(background) {
        /**
         * @type {string}
         */
        this.image = background.image || this.image;
        /**
         * @type {string}
         */
        this.color = background.color || this.color;
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        return new Background({
            image: this.image,
            color: this.color,
        });
    }
}

module.exports = Background;
