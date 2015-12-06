/*var noble = require('noble');

noble.on('stateChange', function(state) {
    if ("poweredOn" === state) {
        noble.startScanning(['f815e810456c6761746f4d756e696368']); // any service UUID, no duplicates
    }
});

var Peripheral;

noble.on('discover', function(peripheral) {
    console.log(peripheral);
    peripheral.connect(function(err) {
        if (err) {
            throw err;
        }
        Peripheral = peripheral;
        peripheral.discoverSomeServicesAndCharacteristics(['f815e810456c6761746f4d756e696368'], ['f815e811456c6761746f4d756e696368'], function(error, services, characteristics) {
            if (error) {
                throw error;
            }
            tryColors(characteristics[0]);
        });

    });
});


function tryColors(characteristic) {
    console.log(characteristic);
    characteristic.on("notify", function(state) {
        console.log("notified", state);
    });
    var i = 0;

    var interval = setInterval(function() {
        var hex = i.toString(16);
        if (hex.length == 1) {
            hex = "0" + hex;
        }
        console.log(i, hex);
        if (i >= 255) {
            clearInterval(interval);
            console.log("finished");
        } else {
            setColor(characteristic, "35:e8:03:0a:00:00:00:ff:3f:00:20:"+hex+":1f");
            i += 10;
        }
    }, 2000);
}

function setColor(characteristic, color) {
    console.log(color);
    console.log(Peripheral.state);
    color = color.replace(/:/g, "");
    var buffer = new Buffer(color, "hex");


    characteristic.write(buffer, true, function(error) {
        if (error) {
            throw error;
        }
    });
}
*/

//require('babel/register');
require('./lib/index.js');

