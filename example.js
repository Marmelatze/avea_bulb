"use strict";

const avea = require("./lib");
const winston = require("winston");
const noble = require("noble");

winston.cli();
var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)()
    ]
});


logger.cli();

noble.on("stateChange", function(state) {
    winston.info("BLE state changed", {state});
    if ('poweredOn' === state) {
        winston.info("BLE start scanning for new devices");
        noble.startScanning(['f815e810456c6761746f4d756e696368']);
        setTimeout(() => {
            winston.info("BLE stop scanning for new devices");
            noble.stopScanning();
        }, 10 * 1000);
    }
});

noble.on("discover", function(peripheral) {
    var bulb = new avea.Avea(peripheral);
    bulb.setColor(new avea.Color(0xaaa, 0xbbb, 0xccc, 0xddd), 0x111);
    bulb.setBrightness(255);
    setInterval(() => {
        Promise.all([bulb.getName(), bulb.getColor(), bulb.getBrightness()]).then((data) => {
            console.log("bulb: name: " + data[0] + ", current color: " + data[1].current + ", target color: " + data[1].target + ", current brightness: " + data[2]);
        }).catch(e => {
            winston.error(e);
        });
    }, 1000 * 2);
});

