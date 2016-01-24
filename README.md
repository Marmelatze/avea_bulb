# Avea Bulb


## Binary Protocol

Communication with a bulb is done via the service `f815e810456c6761746f4d756e696368` and its characteristic `f815e811456c6761746f4d756e696368`.
The first byte in the protocol is the command, the others are the payload. When sending a command without payload the current value from this command is send back as notification.

### Available Commands

* 0x35: Color
* 0x58: User defined name of the bulb
* 0x57: Brightness

### Color

The color is defined by these four variables: white, red, green, blue. Each variable has a value between 0 and 4095 (0xfff).

The byte sequence, which has to be send to bulb can be computed on the following way:

For example we set the color to `w: 0xaaa, r: 0xbbb, g:0xccc, b:0xddd`, with a fading of `0x111` we send:


|   `35`   |    `11 01`|    `0a 00`|    `aa 8a`|    `bb 3b`|    `cc 2c`|    `dd 1d`|
|----------|-----------|-----------|-----------|-----------|-----------|-----------|
|Color command | fading in LE | unkown | white with 8 as prefix | red with 3 as prefix | green with 2 as prefix | blue with 1 as prefix |

To compute the color part the following js function is used:

```javascript
const buffer = new Buffer(8);
buffer.writeUInt16LE(this.white | 0x8000, 0);
buffer.writeUInt16LE(this.red | 0x3000, 2);
buffer.writeUInt16LE(this.green | 0x2000, 4);
buffer.writeUInt16LE(this.blue | 0x1000, 6);
```

The color send back through the notification has a different format. For the same values as set above the following bytes are received:

|  `35` |  `da 0a` | `5e 1d`  | `57 2c` | `4f 3b` | `aa 0a` | `dd 1d` | `cc 2c`| `bb 3b`|
|-------|----------|----------|---------|---------|---------|---------|--------|--------|
| Color command | current white (`0xada`) | current blue (`0xd5e`) | current green (`0xc57`) | current red (`0xb4f`) | target white (`0xaaa`) | target blue (`0xddd`) | target green (`0xccc`) | target red (`0xbbb`) |


```javascript
// command code byte already stripped

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
```


### Name

The name is received as a null terminated string. For example: `0x58 0x45 0x6c 0x67 0x61 0x74 0x6f 0x20 0x41 0x76 0x65 0x61 0x00` = Elgato Avea

### Brightness

Brightness goes from 0-4095 and is send and received as little endian value.

e.g. `0x57ff0f` for 4095.
