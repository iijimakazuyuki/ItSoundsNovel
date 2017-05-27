/**
 * @module BgmConfig
 */

/**
 * Configuration for background music.
 */
class BgmConfig {
    /**
     * @param {{loop: string|{head: number}, bgm: string|string[], duration: number}} direction
     */
    constructor(direction) {
        /**
         * The urls of background music.
         * @type{string[]}
         */
        this.sources = [];

        let bgm = direction.bgm;
        if (bgm === 'stop') {
            this.control = 'stop';
            this.duration = direction.duration || 0;
        } else {
            if (typeof bgm === 'string') {
                this.sources = [bgm];
            } else {
                this.sources = bgm;
            }
        }
        if (typeof direction.loop === 'string') {
            this.loop = direction.loop !== 'none';
        } else {
            this.loop = true;
        }
        if (this.loop) {
            if (direction.loop) {
                /**
                 * @type {number}
                 */
                this.head = direction.loop.head || DEFAULT_LOOP_CONFIG.head;
            } else {
                this.head = DEFAULT_LOOP_CONFIG.head;
            }
        }
    }
    /**
     * Returns a copy of this.
     * @returns {BgmConfig}
     */
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
