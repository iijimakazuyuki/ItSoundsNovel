/**
 * @module message
 */
const Character = require('./character.js');

class Message {
    /**
     * @param {string} message
     */
    constructor(message) {
        /**
         * The letters of the message.
         * @type {Character[]}
         */
        this.letters = [];
        let index = 0;
        let controlCharacterRegex = /\${(.+?)=(.*?)}/g
        let resultArray;
        while ((resultArray = controlCharacterRegex.exec(message))) {
            message.slice(index, resultArray.index).split('').forEach(v => {
                let character = new Character(false, null, v);
                this.letters.push(character);
            });
            let character = new Character(true, resultArray[1], resultArray[2]);
            this.letters.push(character);
            index = controlCharacterRegex.lastIndex;
        }
        message.slice(index).split('').forEach(v => {
            let character = new Character(false, null, v);
            this.letters.push(character);
        });
    }
}

module.exports = Message;
