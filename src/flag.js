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
    update(flag, status = {}) {
        if (typeof flag.value === 'object') {
            if (flag.value.type === 'random') {
                this.value = RANDOM_BETWEEN(flag.value.min, flag.value.max);
            } else if (flag.value.type === 'add') {
                let reference = REFERENCE_FLAG(flag.value.by);
                if (reference && status[reference]) {
                    this.value += status[reference].value;
                } else {
                    this.value += flag.value.by;
                }
            } else if (flag.value.type === 'multiply') {
                let reference = REFERENCE_FLAG(flag.value.by);
                if (reference && status[reference]) {
                    this.value *= status[reference].value;
                } else {
                    this.value *= flag.value.by;
                }
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
    copy() {
        return new Flag(
            this.name,
            this.value,
            this.display,
            this.target
        );
    }
}

const RANDOM_BETWEEN = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

const REFERENCE_FLAG = reference => {
    let referenceRegex = /\${(.+)}/;
    let referenceResultArray = referenceRegex.exec(reference);
    if (referenceResultArray) {
        return referenceResultArray[1];
    }
    return null;
};

module.exports = Flag;
