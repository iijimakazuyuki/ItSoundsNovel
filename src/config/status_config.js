/**
 * @module StatusConfig
 */

const Config = require('./config.js');

class StatusConfig extends Config {
    /**
     * @param {{target: string}} config
     */
    constructor(config) {
        super();
        if (!config) return;
        this.isDefined = true;
        /**
         * The id of the status window.
         * @type {string}
         */
        this.target = config.target;
    }
    /**
     * Update properties with given instance's properties.
     * @param {StatusConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        /**
         * @type {string}
         */
        this.target = config.target || this.target;
    }
    /**
     * Returns a copy of this.
     * @returns {StatusConfig}
     */
    copy() {
        if (!this.isDefined) return new StatusConfig();
        return new StatusConfig({
            target: this.target,
        });
    }
    static defaultValue() {
        return DEFAULT;
    }
}

const DEFAULT = new StatusConfig({
    target: '#statusWindow',
});

module.exports = StatusConfig;
