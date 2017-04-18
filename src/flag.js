/**
 * @module flag
 */

class Flag {
    constructor(value, display) {
        this.value = value;
        if (display) {
            this.display = display;
        } else {
            this.display = 'none';
        }
    }
}

module.exports = Flag;
