/**
 * @module ButtonConfig
 */

const Config = require('./config.js');

class ButtonConfig extends Config {
    constructor(config) {
        super();
        if (!config) return;
        this.isDefined = true;
        /**
         * The id of the button.
         * @type {string}
         */
        this.target = config.target;
        /**
         * The status of the button.
         *
         * - available
         * - unavailable
         * - invisible
         *
         * @type {string}
         */
        this.status = config.status;
    }
    update(config) {
        if (!config.isDefined) return;
        this.target = config.target || this.target;
        this.status = config.status || this.status;
    }
    copy() {
        if (!this.isDefined) return new ButtonConfig();
        return new ButtonConfig({
            target: this.target,
            status: this.status,
        });
    }
}

module.exports = ButtonConfig;

