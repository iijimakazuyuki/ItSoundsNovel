/**
 * @module ButtonConfig
 */

const Config = require('./config.js');

class ButtonConfig extends Config {
    /**
     * @param {{target: string, status: string}} config
     */
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
    /**
     * Update properties with given instance's properties.
     * @param {ButtonConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        /**
         * @type {string}
         */
        this.target = config.target || this.target;
        /**
         * @type {string}
         */
        this.status = config.status || this.status;
    }
    /**
     * Returns a copy of this.
     * @returns {ButtonConfig}
     */
    copy() {
        if (!this.isDefined) return new ButtonConfig();
        return new ButtonConfig({
            target: this.target,
            status: this.status,
        });
    }
}

module.exports = ButtonConfig;

