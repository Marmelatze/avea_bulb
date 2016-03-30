"use strict";

const Avea = require("./avea");
const noble = require("noble");
const winston = require("winston");

winston.cli();
var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)()
    ]
});
logger.cli();

class Registry {
    constructor(stateFile) {
        this.stateFile = stateFile;
        this.bulbs = {};
        this.state = {};
        this.bleReady = false;

        noble.on("stateChange", this._onStateChange.bind(this));
        noble.on("discover", this._onDiscover.bind(this));
    }

    /**
     * @param bulb {#Avea}
     */
    addBulb(bulb) {
        this.bulbs[bulb.id()] = bulb;
        this.update(bulb.id());
        setInterval(this.update.bind(this, bulb.id()), 1000 * 10);
    }

    update(id) {
        const bulb = this.bulbs[id];
        return this._getBulbState(bulb).then(state => {
            this.state[bulb.id()] = state;

            return state;
        });
    }

    all() {
        return this.state;
    }

    getBulb(id) {
        return this.state[id];
    }

    setColor(id, color, delay) {
        this.bulbs[id].setColor(color, delay);
    }

    setBrightness(id, brightness) {
        this.bulbs[id].setBrightness(brightness);
    }

    _getBulbState(bulb) {
        return Promise.all([bulb.getColor(), bulb.getBrightness(), bulb.getName()]).then(data => {
            return {
                id: bulb.id(),
                name: data[2],
                color: data[0],
                brightness: data[1],
                lastSeen: new Date(),
            };
        });
    }

    discover(duration) {
        duration = duration || 10 * 1000;
        if (this.bleReady) {
            return this._doDiscover(duration);
        }
        return new Promise((resolve, reject) => {
            winston.info("Waiting for BLE to become ready");
            const listener = (state) => {
                console.log(state);
                if ("poweredOn" === state) {
                    noble.removeListener("stateChange", listener);
                    resolve(this._doDiscover(duration));
                }
            };
            noble.on("stateChange", listener);
        });
    }

    _doDiscover(duration) {
        winston.info("BLE start scanning for new devices");
        noble.startScanning(['f815e810456c6761746f4d756e696368']);

        setTimeout(() => {
            winston.info("BLE stop scanning for new devices");
            noble.stopScanning();
        }, duration);
    }

    _onStateChange(state) {
        winston.info("BLE state changed", {state});
        if ('poweredOn' === state) {
            this.bleReady = true;
        } else {
            this.bleReady = false;
        }
    }

    _onDiscover(peripheral) {
        this.addBulb(new Avea(peripheral));
    }
}

module.exports = Registry;
