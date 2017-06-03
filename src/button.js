/**
 * @module button
 */

class Button {
    /**
     * @param {{name: string, message: string, status: {name: string, value: number|string}[], hide: string}} button
     */
    constructor(button) {
        this.name = button.name;
        this.message = button.message;
        this.status = button.status;
        this.hide = button.hide;
    }
}

module.exports = Button;