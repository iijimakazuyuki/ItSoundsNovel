/**
 * @module DisplayConfig
 */

const MessageConfig = require('./message_config.js');
const BackgroundConfig = require('./background_config.js');
const ImageConfig = require('./image_config.js');
const OverlayConfig = require('./overlay_config.js');
const StatusConfig = require('./status_config.js');
const UIConfig = require('./ui_config.js');

/**
 * Configuration for display scenarios.
 */
class DisplayConfig {
    /**
     * @param {{message: {target: string, delay: number, duration: number, timingFunction: string, fontSize: string, fontStyle: string, fontWeight: string, fontFamily: string, color: string, background: {color: string, duration: number, timingFunction: string}, position: {x: string|number, y: string|number, width: string|number, height: string|number, scaleX: number, scaleY: number, rotateX: string, rotateY: string, rotateZ: string, duration: number, timingFunction: string}}, background: {target: string, duration :number, timingFunction: string}, overlay: {target: string, duration: number, timingFunction: string}, image: {duration: number, timingFunction: string}, status: {target: string}, ui: {next: {target: string, status: string}, save: {target: string, status: string}, load: {target: string, status: string}}}} config
     */
    constructor(config) {
        this.message = new MessageConfig(config.message);
        this.background = new BackgroundConfig(config.background);
        this.overlay = new OverlayConfig(config.overlay);
        this.image = new ImageConfig(config.image);
        this.status = new StatusConfig(config.status);
        this.ui = new UIConfig(config.ui);
    }
    /**
     * Update properties with given instance's properties.
     * @param {DisplayConfig} config
     */
    update(config) {
        this.message.update(config.message);
        this.background.update(config.background);
        this.overlay.update(config.overlay);
        this.status.update(config.status);
        this.image.update(config.image);
        this.ui.update(config.ui);
    }
    /**
     * Returns a copy of this.
     * @returns {DisplayConfig}
     */
    copy() {
        return new DisplayConfig({
            message: this.message.copy(),
            background: this.background.copy(),
            overlay: this.overlay.copy(),
            image: this.image.copy(),
            status: this.status.copy(),
            ui: this.ui.copy(),
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
    message: MessageConfig.defaultValue(),
    background: BackgroundConfig.defaultValue(),
    overlay: OverlayConfig.defaultValue(),
    image: ImageConfig.defaultValue(),
    status: StatusConfig.defaultValue(),
    ui: UIConfig.defaultValue(),
});

module.exports = DisplayConfig;
