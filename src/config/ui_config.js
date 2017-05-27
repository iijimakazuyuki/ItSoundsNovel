/**
 * @module UIConfig
 */

const Config = require('./config.js');
const ButtonConfig = require('./button_config.js');

class UIConfig extends Config {
    /**
     * @param {{next: {target: string, status: string}, save: {target: string, status: string}, load: {target: string, status: string}}} config
     */
    constructor(config) {
        super();
        if (!config) return;
        this.isDefined = true;
        /**
         * The id of the next button.
         * @type {string}
         */
        this.next = new ButtonConfig(config.next);
        /**
         * The id of the save button.
         * @type {string}
         */
        this.save = new ButtonConfig(config.save);
        /**
         * The id of the load button.
         * @type {string}
         */
        this.load = new ButtonConfig(config.load);
    }
    /**
     * Update properties with given instance's properties.
     * @param {UIConfig} config
     */
    update(config) {
        if (!config.isDefined) return;
        this.next.update(config.next);
        this.save.update(config.save);
        this.load.update(config.load);
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        if (!this.isDefined) return new UIConfig();
        return new UIConfig({
            next: this.next.copy(),
            save: this.save.copy(),
            load: this.load.copy(),
        });
    }
    static defaultValue() {
        return DEFAULT;
    }
}

const DEFAULT = new UIConfig({
    next: {
        target: '#nextButton',
        status: 'available',
    },
    save: {
        target: '#saveButton',
        status: 'available',
    },
    load: {
        target: '#loadButton',
        status: 'available',
    },
});

module.exports = UIConfig;