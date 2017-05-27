/**
 * @module scenario-progress
 */

const DisplayConfig = require('./config/display_config.js');
const Image = require('./image.js');
const BgmConfig = require('./bgm_config.js');
const Background = require('./background.js');
const Overlay = require('./overlay.js');

/**
 * The progress of the scenario.
 */
class ScenarioProgress {
    constructor() {
        /**
         * The position of the loading scenario.
         */
        this.pos = 0;

        /**
         * The url of the loading scenario.
         * @type {string}
         */
        this.scenarioUrl;

        /**
         * The display configuration of the loading scenario.
         * @type {DisplayConfig}
         */
        this.displayConfig = DisplayConfig.defaultDisplayConfig().copy();

        /**
         * The displaying images.
         */
        this.images = {};

        /**
         * The configuration for background music.
         * @type {BgmConfig}
         */
        this.bgmConfig = null;

        /**
         * The background.
         * @type {Background}
         */
        this.background = new Background({
            image: null,
            color: 'transparent',
        });

        /**
         * The overlay.
         * @type {Overlay}
         */
        this.overlay = new Overlay({
            color: 'transparent',
            opacity: '1.0',
        });

        /**
         * The status.
         */
        this.status = {};
    }
    /**
     * Update properties with given instance's properties.
     * @param {ScenarioProgress} progress
     */
    update(progress) {
        if (progress.pos) {
            this.pos = progress.pos;
        }
        if (progress.scenarioUrl) {
            this.scenarioUrl = progress.scenarioUrl;
        }
        if (progress.displayConfig) {
            this.displayConfig.update(progress.displayConfig);
        }
        for (let key in progress.images) {
            this.images[key] = new Image(progress.images[key]);
        }
        if (progress.bgmConfig) {
            this.bgmConfig = new BgmConfig({
                bgm: progress.bgmConfig.sources,
                loop: progress.bgmConfig.loop,
                head: progress.bgmConfig.head,
            });
        }
        if (progress.background) {
            this.background.update(progress.background);
        }
        if (progress.overlay) {
            this.overlay.update(progress.overlay);
        }
        for (let name in progress.status) {
            this.status[name] = progress.status[name];
        }
    }
    /**
     * Returns a copy of this.
     */
    copy() {
        let ret = new ScenarioProgress();
        ret.pos = this.pos;
        ret.scenarioUrl = this.scenarioUrl;
        ret.displayConfig = this.displayConfig.copy();
        for (let key in this.images) {
            ret.images[key] = this.images[key].copy();
        }
        if (this.bgmConfig) ret.bgmConfig = this.bgmConfig.copy();
        ret.background = this.background.copy();
        ret.overlay = this.overlay.copy();
        for (let key in this.status) {
            ret.status[key] = this.status[key].copy();
        }
        return ret;
    }
}

module.exports = ScenarioProgress;
