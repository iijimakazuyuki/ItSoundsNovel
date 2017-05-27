/**
 * @module overlay
 */

/**
 * Overlay.
 */
class Overlay {
    /**
     * @param {{color: string, opacity: number}} overlay
     */
    constructor(overlay) {
        this.color = overlay.color;
        this.opacity = overlay.opacity || '1.0';
    }
    /**
     * Update properties with given instance's properties.
     * @param {Overlay} overlay
     */
    update(overlay) {
        /**
         * @type {number}
         */
        this.opacity = overlay.opacity || this.opacity;
        /**
         * @type {string}
         */
        this.color = overlay.color || this.color;
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        return new Overlay({
            color: this.color,
            opacity: this.opacity,
        });
    }
}

module.exports = Overlay;
