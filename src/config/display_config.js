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
    constructor(config) {
        this.message = new MessageConfig(config.message);
        this.background = new BackgroundConfig(config.background);
        this.overlay = new OverlayConfig(config.overlay);
        this.image = new ImageConfig(config.image);
        this.status = new StatusConfig(config.status);
        this.ui = new UIConfig(config.ui);
    }
    update(config) {
        this.message.update(config.message);
        this.background.update(config.background);
        this.overlay.update(config.overlay);
        this.status.update(config.status);
        this.image.update(config.image);
        this.ui.update(config.ui);
    }
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
