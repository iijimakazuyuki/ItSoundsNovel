/**
 * @module DisplayConfig
 */

/**
 * Configuration for display scenarios.
 */
class DisplayConfig {
    constructor(config) {
        this.message = {};
        if (config.delay) this.message.delay = config.delay;
        if (config.duration) this.message.duration = config.duration;
        if (config.message) this.message = config.message;
        this.background = {};
        if (config.background) this.background = config.background;
        this.image = {};
        if (config.image) this.image = config.image;
        if (config.ui) this.ui = config.ui;
    }
    update(config) {
        if (config.delay) this.message.delay = config.delay;
        if (config.duration) this.message.duration = config.duration;
        if (config.message) {
            if (config.message.delay) {
                this.message.delay = config.message.delay;
            }
            if (config.message.duration) {
                this.message.duration = config.message.duration;
            }
        }
        if (config.background) {
            if (config.background.target) {
                this.background.target = config.background.target;
            }
            if (config.background.duration) {
                this.background.duration = config.background.duration;
            }
        }
        if (config.image) {
            if (config.image.duration) {
                this.image.duration = config.image.duration;
            }
        }
        if (config.ui) this.ui = config.ui;
    }
    copy() {
        return new DisplayConfig({
            message: {
                target: this.message.target,
                delay: this.message.delay,
                duration: this.message.duration,
            },
            background: {
                target: this.background.target,
                duration: this.background.duration,
            },
            image: {
                duration: this.image.duration,
            },
            ui: {
                next: this.ui.next,
                save: this.ui.save,
                load: this.ui.load,
            },
        });
    }
    /**
     * Default display configuration.
     */
    static defaultDisplayConfig() {
        return DEFAULT_DISPLAY_CONFIG;
    }
}

const DEFAULT_DISPLAY_CONFIG = new DisplayConfig({
    message: {
        target: '#messageWindow',
        delay: 50,
        duration: 500,
    },
    background: {
        target: '#backgroundWindow',
        duration: 1000,
    },
    image: {
        duration: 1000,
    },
    ui: {
        next: '#nextButton',
        save: '#saveButton',
        load: '#loadButton',
    },
});
module.exports = DisplayConfig;
