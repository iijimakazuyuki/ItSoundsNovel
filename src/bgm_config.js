/**
 * @module BgmConfig
 */

/**
 * Configuration for background music.
 */
class BgmConfig {
    constructor(direction) {
        /**
         * The urls of background music.
         * @type{string[]}
         */
        this.sources = [];

        let loopConfig = direction.loop || DEFAULT_LOOP_CONFIG;
        let bgm = direction.bgm;
        if (bgm === 'stop') {
            this.control = 'stop';
            this.duration = direction.duration || 0;
        } else if (typeof bgm === 'string') {
            this.sources = [bgm];
        } else {
            this.sources = bgm;
        }
        if (typeof loopConfig === 'string') {
            this.loop = loopConfig !== 'none';
        } else {
            if (loopConfig.loop) this.loop = loopConfig.loop;
            else this.loop = DEFAULT_LOOP_CONFIG.loop;
            if (loopConfig.head) this.head = loopConfig.head;
            else this.head = DEFAULT_LOOP_CONFIG.head;
        }
    }
    copy() {
        let ret = new BgmConfig();
        for (let i in this.sources) {
            ret.sources[i] = this.sources[i];
        }
        ret.control = this.control;
        ret.duration = this.duration;
        ret.loop = this.loop;
        ret.head = this.head;
        return ret;
    }

    /**
     * Default loop configuration.
     */
    static defaultLoopConfig() {
        return DEFAULT_LOOP_CONFIG;
    }
}

/**
 * Default loop configuration.
 */
const DEFAULT_LOOP_CONFIG = {
    loop: true,
    head: 0,
};

module.exports = BgmConfig;
