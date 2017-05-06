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
        if (config.message) {
            this.updateMessageConfig(config.message);
            if (config.message.background) {
                this.message.background = {
                    color: config.message.background.color,
                    duration: config.message.background.duration,
                };
            }
        }
        this.background = {};
        if (config.background) this.background = config.background;
        this.overlay = {};
        if (config.overlay) this.overlay = config.overlay;
        this.image = {};
        if (config.image) this.image = config.image;
        this.status = {};
        if (config.status) this.status = config.status;
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
        if (config.color) this.message.color = config.color;
    }
    update(config) {
        this.updateMessageConfig(config);
        if (config.message) {
            this.updateMessageConfig(config.message);
            if (config.message.background) {
                if (config.message.background.color) {
                    this.message.background.color
                        = config.message.background.color;
                }
                if (config.message.background.duration) {
                    this.message.background.duration
                        = config.message.background.duration;
                }
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
        if (config.overlay) {
            if (config.overlay.target) {
                this.overlay.target = config.overlay.target;
            }
            if (config.overlay.duration) {
                this.overlay.duration = config.overlay.duration;
            }
        }
        if (config.status) {
            if (config.status.target) {
                this.status.target = config.status.target;
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
                color: this.message.color,
                background: {
                    color: this.message.background.color,
                    duration: this.message.background.duration,
                },
            },
            background: {
                target: this.background.target,
                duration: this.background.duration,
            },
            overlay: {
                target: this.overlay.target,
                duration: this.overlay.duration,
            },
            image: {
                duration: this.image.duration,
            },
            status: {
                target: this.status.target,
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
        background: {
            color: 'transparent',
            duration: 1000,
        },
    },
    background: {
        target: '#backgroundWindow',
        duration: 1000,
    },
    overlay: {
        target: '#backgroundWindow',
        duration: 1000,
    },
    image: {
        duration: 1000,
    },
    status: {
        target: '#statusWindow',
    },
    ui: {
        next: '#nextButton',
        save: '#saveButton',
        load: '#loadButton',
    },
});
module.exports = DisplayConfig;
