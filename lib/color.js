"use strict";

class Color {
    /**
     * each parameter goes from 0-4095 (0xfff)
     *
     * @param white
     * @param red
     * @param green
     * @param blue
     */
    constructor(white, red, green, blue) {
        this.white = white;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    toString() {
        return "{white: " + this.white + ", red: " + this.red + ", green: " + this.green + ", blue: " + this.blue + "}";
    }

    toBuffer() {
        let color = new Buffer(8);
        color.writeUInt16BE(this.white, 0);
        color.writeUInt16BE(this.red, 2);
        color.writeUInt16BE(this.green, 4);
        color.writeUInt16BE(this.blue, 6);

        const buffer = new Buffer(8);
        buffer.writeUInt16LE(this.white | 0x8000, 0);
        buffer.writeUInt16LE(this.red | 0x3000, 2);
        buffer.writeUInt16LE(this.green | 0x2000, 4);
        buffer.writeUInt16LE(this.blue | 0x1000, 6);

        return buffer;
    }

    static fromResponse(buffer) {
        // these are the current colors of the lamp.
        let white = buffer.readUInt16LE(0);
        let blue = buffer.readUInt16LE(2) ^ 0x1000;
        let green = buffer.readUInt16LE(4) ^ 0x2000;
        let red = buffer.readUInt16LE(6) ^ 0x3000;

        // these are the colors the lamp is fading to.
        let whiteTarget = buffer.readUInt16LE(8);
        let blueTarget = buffer.readUInt16LE(10) ^ 0x1000;
        let greenTarget = buffer.readUInt16LE(12) ^ 0x2000;
        let redTarget = buffer.readUInt16LE(14) ^ 0x3000;

        return {
            current: new Color(white, red, green, blue),
            target: new Color(whiteTarget, redTarget, greenTarget, blueTarget)
        };
    }
}
module.exports = Color;
