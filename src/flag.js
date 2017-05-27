/**
 * @module flag
 */

class Flag {
    /**
     * @param {{name: string, value: string|{type: string, max: number, min: number, by: string|number}, display: string, target: string} flag
     */
    constructor(flag) {
        this.name = flag.name;
        if (typeof flag.value === 'object') {
            if (flag.value.type === 'random') {
                /**
                 * @type {number}
                 */
                this.value = randomBetween(flag.value.min, flag.value.max);
            }
        } else {
            /**
             * @type {string|{type: string, by: string|number}}
             */
            this.value = flag.value;
        }
        this.display = flag.display || 'none';
        this.target = flag.target;
    }
    /**
     * Update properties with given instance's properties.
     * @param {Flag} flag
     * @param {object} status
     */
    update(flag, status = {}) {
        if (typeof flag.value === 'object') {
            if (flag.value.type === 'random') {
                /**
                 * @type {number}
                 */
                this.value = randomBetween(flag.value.min, flag.value.max);
            } else if (flag.value.type === 'add') {
                let reference = referenceFlag(flag.value.by);
                if (reference && status[reference]) {
                    /**
                     * @type {number}
                     */
                    this.value += status[reference].value;
                } else {
                    /**
                     * @type {number}
                     */
                    this.value += flag.value.by;
                }
            } else if (flag.value.type === 'multiply') {
                let reference = referenceFlag(flag.value.by);
                if (reference && status[reference]) {
                    /**
                     * @type {number}
                     */
                    this.value *= status[reference].value;
                } else {
                    /**
                     * @type {number}
                     */
                    this.value *= flag.value.by;
                }
            }
        } else {
            /**
             * @type {number}
             */
            this.value = flag.value;
        }
        /**
         * @type {string}
         */
        this.display = flag.display || this.display;
        /**
         * @type {string}
         */
        this.target = flag.target || this.target;
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        return new Flag({
            name: this.name,
            value: this.value,
            display: this.display,
            target: this.target,
        });
    }
}

/**
 * Returns an integer value randomly between min and max.
 * @param {number} min
 * @param {number} max
 */
const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Returns a flag name extracted from given string, or returns null.
 * @param {string} reference The string like `${name}`.
 */
const referenceFlag = reference => {
    let referenceRegex = /\${(.+)}/;
    let referenceResultArray = referenceRegex.exec(reference);
    if (referenceResultArray) {
        return referenceResultArray[1];
    }
    return null;
};

module.exports = Flag;
