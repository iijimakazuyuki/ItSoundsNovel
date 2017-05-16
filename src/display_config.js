/**
 * @module DisplayConfig
 */

const NORMALIZE_POSITION = x => {
    if (isFinite(x) && x !== 0) return x + 'px';
    return String(x);
};

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
                    timingFunction: config.message.background.timingFunction,
                };
            }
            if (config.message.position) {
                this.message.position = {
                    x: NORMALIZE_POSITION(config.message.position.x),
                    y: NORMALIZE_POSITION(config.message.position.y),
                    width: config.message.position.width,
                    height: config.message.position.height,
                    scaleX: config.message.position.scaleX,
                    scaleY: config.message.position.scaleY,
                    rotateX: config.message.position.rotateX,
                    rotateY: config.message.position.rotateY,
                    rotateZ: config.message.position.rotateZ,
                    duration: config.message.position.duration,
                    timingFunction: config.message.position.timingFunction,
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
        if (config.timingFunction) this.message.timingFunction = config.timingFunction;
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
                if (config.message.background.timingFunction) {
                    this.message.background.timingFunction
                        = config.message.background.timingFunction;
                }
            }
            if (config.message.position) {
                if (config.message.position.x || config.message.position.x === 0) {
                    this.message.position.x
                        = config.message.position.x;
                }
                if (config.message.position.y || config.message.position.y === 0) {
                    this.message.position.y
                        = config.message.position.y;
                }
                if (config.message.position.width || config.message.position.width === 0) {
                    this.message.position.width
                        = config.message.position.width;
                }
                if (config.message.position.height || config.message.position.height === 0) {
                    this.message.position.height
                        = config.message.position.height;
                }
                if (config.message.position.scaleX) {
                    this.message.position.scaleX
                        = config.message.position.scaleX;
                }
                if (config.message.position.scaleY) {
                    this.message.position.scaleY
                        = config.message.position.scaleY;
                }
                if (config.message.position.rotateX) {
                    this.message.position.rotateX
                        = config.message.position.rotateX;
                }
                if (config.message.position.rotateY) {
                    this.message.position.rotateY
                        = config.message.position.rotateY;
                }
                if (config.message.position.rotateZ) {
                    this.message.position.rotateZ
                        = config.message.position.rotateZ;
                }
                if (config.message.position.duration) {
                    this.message.position.duration
                        = config.message.position.duration;
                }
                if (config.message.position.timingFunction) {
                    this.message.position.timingFunction
                        = config.message.position.timingFunction;
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
            if (config.background.timingFunction) {
                this.background.timingFunction = config.background.timingFunction;
            }
        }
        if (config.overlay) {
            if (config.overlay.target) {
                this.overlay.target = config.overlay.target;
            }
            if (config.overlay.duration) {
                this.overlay.duration = config.overlay.duration;
            }
            if (config.overlay.timingFunction) {
                this.overlay.timingFunction = config.overlay.timingFunction;
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
            if (config.image.timingFunction) {
                this.image.timingFunction = config.image.timingFunction;
            }
        }
        if (config.ui) {
            if (config.ui.next) {
                if (config.ui.next.target) {
                    this.ui.next.target = config.ui.next.target;
                }
                if (config.ui.next.status) {
                    this.ui.next.status = config.ui.next.status;
                }
            }
            if (config.ui.save) {
                if (config.ui.save.target) {
                    this.ui.save.target = config.ui.save.target;
                }
                if (config.ui.save.status) {
                    this.ui.save.status = config.ui.save.status;
                }
            }
            if (config.ui.load) {
                if (config.ui.load.target) {
                    this.ui.load.target = config.ui.load.target;
                }
                if (config.ui.load.status) {
                    this.ui.load.status = config.ui.load.status;
                }
            }
        }
    }
    copy() {
        return new DisplayConfig({
            message: {
                target: this.message.target,
                delay: this.message.delay,
                duration: this.message.duration,
                timingFunction: this.message.timingFunction,
                fontSize: this.message.fontSize,
                fontStyle: this.message.fontStyle,
                fontWeight: this.message.fontWeight,
                fontFamily: this.message.fontFamily,
                color: this.message.color,
                background: {
                    color: this.message.background.color,
                    duration: this.message.background.duration,
                    timingFunction: this.message.background.timingFunction,
                },
                position: {
                    x: this.message.position.x,
                    y: this.message.position.y,
                    width: this.message.position.width,
                    height: this.message.position.height,
                    scaleX: this.message.position.scaleX,
                    scaleY: this.message.position.scaleY,
                    rotateX: this.message.position.rotateX,
                    rotateY: this.message.position.rotateY,
                    rotateZ: this.message.position.rotateZ,
                    duration: this.message.position.duration,
                    timingFunction: this.message.position.timingFunction,
                },
            },
            background: {
                target: this.background.target,
                duration: this.background.duration,
                timingFunction: this.background.timingFunction,
            },
            overlay: {
                target: this.overlay.target,
                duration: this.overlay.duration,
                timingFunction: this.overlay.timingFunction,
            },
            image: {
                duration: this.image.duration,
                timingFunction: this.image.timingFunction,
            },
            status: {
                target: this.status.target,
            },
            ui: {
                next: {
                    target: this.ui.next.target,
                    status: this.ui.next.status,
                },
                save: {
                    target: this.ui.save.target,
                    status: this.ui.save.status,
                },
                load: {
                    target: this.ui.load.target,
                    status: this.ui.load.status,
                },
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
        timingFunction: 'linear',
        fontSize: 'medium',
        fontStyle: 'normal',
        fontWeight: 'normal',
        background: {
            color: 'transparent',
            duration: 1000,
            timingFunction: 'linear',
        },
        position: {
            x: 0,
            y: 0,
            width: 'auto',
            height: 'auto',
            scaleX: 1,
            scaleY: 1,
            rotateX: '0deg',
            rotateY: '0deg',
            rotateZ: '0deg',
            duration: 1000,
            timingFunction: 'linear',
        },
    },
    background: {
        target: '#backgroundWindow',
        duration: 1000,
        timingFunction: 'linear',
    },
    overlay: {
        target: '#backgroundWindow',
        duration: 1000,
        timingFunction: 'linear',
    },
    image: {
        duration: 1000,
        timingFunction: 'linear',
    },
    status: {
        target: '#statusWindow',
    },
    ui: {
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
    },
});
module.exports = DisplayConfig;
