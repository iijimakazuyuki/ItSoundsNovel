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
        let controlCharacterRegex = /\${(.*?)}/g
        let keyValueControlCharacterRegex = /(.+?)=(.*?)$/
        let hyperlinkControlCharacterRegex = /\[(.*?)\]\((.*?)\)/
        let rubyControlCharacterRegex = /(.*?)\((.*?)\)/
        let resultArray;
        while ((resultArray = controlCharacterRegex.exec(message))) {
            message.slice(index, resultArray.index).split('').forEach(v => {
                let character = new Character(null, null, v);
                this.letters.push(character);
            });
            let controlCharacter = resultArray[1];
            let keyValueResultArray
                = keyValueControlCharacterRegex.exec(controlCharacter);
            if (keyValueResultArray) {
                let key = keyValueResultArray[1];
                let value = keyValueResultArray[2];
                if (key === 'sleep') {
                    let character = new Character('sleep', key, value);
                    this.letters.push(character);
                } else {
                    let character = new Character('keyValue', key, value);
                    this.letters.push(character);
                }
            } else {
                let hyperlinkResultArray
                    = hyperlinkControlCharacterRegex.exec(controlCharacter);
                if (hyperlinkResultArray) {
                    let key = hyperlinkResultArray[1];
                    let value = hyperlinkResultArray[2];
                    let character
                        = new Character('hyperlink', key, value);
                    this.letters.push(character);
                } else {
                    let rubyResultArray
                        = rubyControlCharacterRegex.exec(controlCharacter);
                    if (rubyResultArray) {
                        let key = rubyResultArray[1];
                        let value = rubyResultArray[2];
                        let character = new Character('ruby', key, value);
                        this.letters.push(character);
                    }
                }
            }
            index = controlCharacterRegex.lastIndex;
        }
        message.slice(index).split('').forEach(v => {
            let character = new Character(null, null, v);
            this.letters.push(character);
        });
    }
}

module.exports = Message;
