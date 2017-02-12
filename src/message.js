/**
 * @module message
 */

class Message {
    /**
     * @param {string} message
     */
    constructor(message) {
        /**
         * The letters of the message.
         * @type {string[]}
         */
        this.letters = message.split('');
    }
}

module.exports = Message;
