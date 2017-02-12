/**
 * @module sound
 */

class Sound {
    constructor(sound) {
        if (sound === 'stop') {
            this.control = 'stop';
        } else if (typeof sound === 'string') {
            this.source = [sound];
        } else {
            this.source = sound;
        }
    }
}

module.exports = Sound;
