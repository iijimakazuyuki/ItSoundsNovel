/**
 * @module flag
 */

class Flag {
    constructor(flag) {
        this.name = flag.name;
        if (typeof flag.value === 'object') {
            if (flag.value.type === 'random') {
                this.value = RANDOM_BETWEEN(flag.value.min, flag.value.max);
            }
        } else {
            this.value = flag.value;
        }
        if (flag.display) {
            this.display = flag.display;
        } else {
            this.display = 'none';
        }
        if (flag.target) {
            this.target = flag.target;
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
        return new Flag({
            name: this.name,
            value: this.value,
            display: this.display,
            target: this.target,
        });
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
