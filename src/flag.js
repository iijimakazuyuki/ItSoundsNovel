/**
 * @module flag
 */

class Flag {
    constructor(value, display, target) {
        this.value = value;
        if (display) {
            this.display = display;
        } else {
            this.display = 'none';
        }
        if (target) {
            this.target = target;
        }
    }
}

module.exports = Flag;
