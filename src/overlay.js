/**
 * @module overlay
 */

class Overlay {
    constructor(overlay) {
        this.color = overlay.color;
        if (overlay.opacity) {
            this.opacity = overlay.opacity;
        } else {
            this.opacity = '1.0';
        }
    }
    update(overlay) {
        if (overlay.opacity) {
            this.opacity = overlay.opacity;
        }
        if (overlay.color) {
            this.color = overlay.color;
        }
    }
}

module.exports = Overlay;
