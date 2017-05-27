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
    /**
     * @param {string|{message: string, background: {image: string, color: string}, overlay: {color: string, opacity: number}, image:{source: string, name: string, control: string, x: string|number, y: string|number, z: number, width: string|number, height: string|number, scaleX: number, scaleY: number, rotateX: string, rotateY: string, rotateZ: string}, config: {}, sound: {}, bgm: {}, load: string, next: string, wait: number, auto: number, flush: string, concat: string, if: {name: string, value: number|string}[], status: {message: {target: string, delay: number, duration: number, timingFunction: string, fontSize: string, fontStyle: string, fontWeight: string, fontFamily: string, color: string, background: {color: string, duration: number, timingFunction: string}, position: {x: string|number, y: string|number, width: string|number, height: string|number, scaleX: number, scaleY: number, rotateX: string, rotateY: string, rotateZ: string, duration: number, timingFunction: string}}, background: {target: string, duration :number, timingFunction: string}, overlay: {target: string, duration: number, timingFunction: string}, image: {duration: number, timingFunction: string}, status: {target: string}, ui: {next: {target: string, status: string}, save: {target: string, status: string}, load: {target: string, status: string}}}, button: {name: string, message: string, status: {name: string, value: number|string}[]}[]}} direction
     */
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