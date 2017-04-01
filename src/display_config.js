/**
 * @module DisplayConfig
 */

/**
 * Configuration for display scenarios.
 */
class DisplayConfig {
    constructor(config) {
        this.message = {};
        this.updateMessageConfig(config);
        if (config.message) this.updateMessageConfig(config.message);
        this.background = {};
        if (config.background) this.background = config.background;
        this.image = {};
        if (config.image) this.image = config.image;
        if (config.ui) this.ui = config.ui;
    }
    updateMessageConfig(config) {
        if (config.target) this.message.target = config.target;
        if (config.delay) this.message.delay = config.delay;
        if (config.duration) this.message.duration = config.duration;
        if (config.fontSize) this.message.fontSize = config.fontSize;
        if (config.fontStyle) this.message.fontStyle = config.fontStyle;
        if (config.fontWeight) this.message.fontWeight = config.fontWeight;
        if (config.fontFamily) this.message.fontFamily = config.fontFamily;
    }
    update(config) {
        this.updateMessageConfig(config);
        if (config.message) this.updateMessageConfig(config.message);
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
                fontSize: this.message.fontSize,
                fontStyle: this.message.fontStyle,
                fontWeight: this.message.fontWeight,
                fontFamily: this.message.fontFamily,
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
        fontSize: 'medium',
        fontStyle: 'normal',
        fontWeight: 'normal',
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
