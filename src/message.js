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
            let keyValueResultArray = keyValueControlCharacterRegex.exec(resultArray[1]);
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
                let hyperlinkResultArray = hyperlinkControlCharacterRegex.exec(resultArray[1]);
                if (hyperlinkResultArray) {
                    let character = new Character('hyperlink', hyperlinkResultArray[1], hyperlinkResultArray[2]);
                    this.letters.push(character);
                } else {
                    let rubyResultArray = rubyControlCharacterRegex.exec(resultArray[1]);
                    if (rubyResultArray) {
                        let character = new Character('ruby', rubyResultArray[1], rubyResultArray[2]);
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
