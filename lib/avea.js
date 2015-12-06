"use strict";

let COLOR_SERVICE_ID = "f815e810456c6761746f4d756e696368";
let COLOR_CHARACTERISTIC_ID = "f815e811456c6761746f4d756e696368";
class Avea {
    constructor(peripheral) {
        this.peripheral = peripheral;
        this.connected = false;
        this.colorCharacteristic = null;


        peripheral.on('connect', () => { this.connected = true; });
        peripheral.on('diconnect', () => { console.log("disconnected"); this.connected = false; });
    }


    connect() {
        return new Promise((resolve, reject) => {
            if (this.connected && this.peripheral.state === "connected") {
                resolve();
                return;
            }

            this.peripheral.connect(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    _getColorCharacteristic() {
        return this.connect().then(() => {
            return new Promise((resolve, reject) => {
                if (null !== this.colorCharacteristic) {
                    resolve(this.colorCharacteristic);
                } else {
                    this.peripheral.discoverSomeServicesAndCharacteristics([COLOR_SERVICE_ID], [COLOR_CHARACTERISTIC_ID], (err, services, characteristics) => {
                        if (err) {
                            reject(err);
                        } else {
                            this.colorCharacteristic = characteristics[0];
                            resolve(this.colorCharacteristic);
                        }
                    });
                }
            });
        });
    }

    setColor(color) {
        this._getColorCharacteristic().then((characteristic) => {
            console.log(color, this.peripheral.state);
            color = color.replace(/:/g, "");
            let buffer = new Buffer(color, "hex");

            characteristic.write(buffer, true, function(error) {
                if (error) {
                    throw error;
                }
            });
        });
    }
}

module.exports = Avea;
