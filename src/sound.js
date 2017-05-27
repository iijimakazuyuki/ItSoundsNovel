/**
 * @module sound
 */

/**
 * Sound.
 */
class Sound {
    /**
     * @param {string|string[]}} sound One or more sources of sound to play,
     * or `stop`.
     */
    constructor(sound) {
        if (sound === 'stop') {
            /**
             * Takes `stop` when any sounds should be stopped.
             * @type {string}
             */
            this.control = 'stop';
        } else if (typeof sound === 'string') {
            /**
             * Sources of sound.
             * @type {string[]}
             */
            this.source = [sound];
        } else {
            /**
             * Sources of sound.
             * @type {string}
             */
            this.source = sound;
        }
    }
}

module.exports = Sound;
