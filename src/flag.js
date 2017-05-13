/**
 * @module flag
 */

class Flag {
    constructor(name, value, display, target) {
        this.name = name;
        if (typeof value === 'object') {
            if (value.type === 'random') {
                this.value = RANDOM_BETWEEN(value.min, value.max);
            }
        } else {
            this.value = value;
        }
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

const RANDOM_BETWEEN = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

module.exports = Flag;
