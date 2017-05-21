/**
 * @module StatusConfig
 */

const Config = require('./config.js');

class StatusConfig extends Config {
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
    update(config) {
        if (!config.isDefined) return;
        this.target = config.target || this.target;
    }
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
