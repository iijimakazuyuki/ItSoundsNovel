/**
 * @module scenario-progress
 */

const DisplayConfig = require('./display_config.js');
const Image = require('./image.js');
const BgmConfig = require('./bgm_config.js');

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
         * The url of the background image.
         * @type {string}
         */
        this.backgroundUrl = null;
    }
    update(progress) {
        if (progress.pos) this.pos = progress.pos;
        if (progress.scenarioUrl) this.scenarioUrl = progress.scenarioUrl;
        if (progress.displayConfig) this.displayConfig.update(progress.displayConfig);
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
        if (progress.backgroundUrl) this.backgroundUrl = progress.backgroundUrl;
    }
}

module.exports = ScenarioProgress;
