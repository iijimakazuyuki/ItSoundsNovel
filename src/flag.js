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
    update(flag) {
        if (typeof flag.value === 'object') {
            if (flag.value.type === 'random') {
                this.value = RANDOM_BETWEEN(flag.value.min, flag.value.max);
            } else if (flag.value.type === 'add') {
                this.value += flag.value.by;
            } else if (flag.value.type === 'multiply') {
                this.value *= flag.value.by;
            }
        } else {
            this.value = flag.value;
        }
        if (flag.display) {
            this.display = flag.display;
        }
        if (flag.target) {
            this.target = flag.target;
        }
    }
}

const RANDOM_BETWEEN = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

module.exports = Flag;
