/**
 * @module character
 */

class Character {
    /**
     * @param {string} type
     * @param {string} key
     * @param {string} value
     */
    constructor(type, key, value) {
        this.type = type;
        this.key = key;
        this.value = value;
    }
    /**
     * Return true if this is key-value control character.
     */
    isKeyValue() {
        return this.type === 'keyValue';
    }
    /**
     * Return true if this is hyperlink control character.
     */
    isHyperlink() {
        return this.type === 'hyperlink';
    }
    /**
     * Return true if this is sleep control character.
     */
    isSleep() {
        return this.type === 'sleep';
    }
    /**
     * Return true if this is ruby control character.
     */
    isRuby() {
        return this.type === 'ruby';
    }
}

module.exports = Character;
