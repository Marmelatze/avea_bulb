"use strict";

let noble = require('noble');
let Avea = require('./avea');


noble.on('stateChange', function(state) {
    console.log(state);
    if ('poweredOn' === state) {
        noble.startScanning(['f815e810456c6761746f4d756e696368']);
    }
});

noble.on('discover', function(peripheral) {
    var bulb = new Avea(peripheral);
    bulb.setColor("35:e8:03:0a:00:94:00:a2:30:ff:2f:00:10");
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
            bulb.setColor("35:e8:03:0a:00:00:00:ff:3f:00:20:" + hex + ":1f");
            i += 10;
        }
    }, 2000);
});

