/**
 * @module button
 */

class Button {
    /**
     * @param {{name: string, message: string, status: string}} button
     */
    constructor(button) {
        this.name = button.name;
        this.message = button.message;
        this.status = button.status;
    }
}

module.exports = Button;