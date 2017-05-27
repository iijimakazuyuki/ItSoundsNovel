/**
 * @module direction
 */

const DisplayConfig = require('./config/display_config.js');
const BgmConfig = require('./bgm_config.js');
const Image = require('./image.js');
const Sound = require('./sound.js');
const Message = require('./message.js');
const Button = require('./button.js');
const Overlay = require('./overlay.js');

/**
 * A direction of a scenario.
 */
class Direction {
    constructor(direction) {
        if (typeof direction === 'string'
            || typeof direction === 'number') {
            this.message = new Message(String(direction));
            return;
        }
        if (direction.message) {
            this.message = new Message(String(direction.message));
        }
        if (direction.background) {
            this.background = direction.background;
            if (direction.config) {
                this.config = new DisplayConfig({
                    background: direction.config
                });
            }
        } else if (direction.overlay) {
            this.overlay = new Overlay(direction.overlay);
            if (direction.config) {
                this.config = new DisplayConfig({
                    overlay: direction.config
                });
            }
        } else if (direction.image) {
            this.image = new Image(direction.image);
            if (direction.config) {
                this.config = new DisplayConfig({
                    image: direction.config
                });
            }
        } else if (direction.message) {
            if (direction.config) {
                this.config = new DisplayConfig({
                    message: direction.config
                });
            }
        } else {
            if (direction.config) {
                this.config = new DisplayConfig(direction.config);
            }
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
        if (direction.auto || direction.auto === 0) {
            this.auto = Number(direction.auto);
        }
        if (direction.flush) {
            this.flush = direction.flush;
        }
        if (direction.concat) {
            this.concat = direction.concat;
        }
        if (direction.if) {
            this.if = direction.if;
        }
        if (direction.status) {
            this.status = direction.status;
        }
        if (direction.button) {
            this.button = direction.button.map(button => new Button(button));
        }
    }
}

module.exports = Direction;