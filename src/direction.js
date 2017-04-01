/**
 * @module direction
 */

const DisplayConfig = require('./display_config.js');
const BgmConfig = require('./bgm_config.js');
const Image = require('./image.js');
const Sound = require('./sound.js');
const Message = require('./message.js');

/**
 * A direction of a scenario.
 */
class Direction {
    constructor(direction) {
        if (typeof direction === 'string' || typeof direction === 'number') {
            this.message = new Message(String(direction));
            return;
        }
        if (direction.message) this.message = new Message(direction.message);
        if (direction.background) {
            this.background = direction.background;
            if (direction.config) this.config = new DisplayConfig({ background: direction.config });
        } else if (direction.image) {
            this.image = new Image(direction.image);
            if (direction.config) this.config = new DisplayConfig({ image: direction.config });
        } else {
            if (direction.config) this.config = new DisplayConfig(direction.config);
        }
        if (direction.sound) {
            this.sound = new Sound(direction.sound);
        }
        if (direction.bgm) {
            this.bgm = new BgmConfig(direction);
        }
        if (direction.load) {
            this.load = direction.load;
        }
        if (direction.next) {
            this.next = direction.next;
        }
        if (direction.wait) {
            this.wait = direction.wait;
        }
    }
}

module.exports = Direction;