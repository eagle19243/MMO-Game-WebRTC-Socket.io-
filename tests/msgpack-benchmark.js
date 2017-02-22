'use strict';
var msgpack5 = require('msgpack5')();
var msgpack = require('msgpack');
var msgpackLite = require('msgpack-lite');
var msgpackjs = require('msgpack-js');

var obj = {
  radius: 0,
  ceilsId: 1,
  cells:
   [ { mass: 30,
       x: 3979.720898822736,
       y: 4987.712215516563,
       radius: 36.863353450309965,
       speed: 4.5,
       id: '0@W7IjFXaeJdUyx8M-AAAH' } ],
  massTotal: 30,
  admin: false,
  id: 'W7IjFXaeJdUyx8M-AAAH',
  name: 'blobber1',
  x: 0,
  y: 0,
  w: 5000,
  h: 5000,
  hue: 292,
  type: 'player',
  lastHeartbeat: 1483823808900,
  score: 0,
  bonus: { got: {} },
  power: { current: 'splitter', next: 'invisible' },
  sprite: 'wiz',
  target: { x: -304.2409638554217, y: 420 }
};

var TIMES = 10000;
var packed, unpacked;

console.time('msgpack5');
for (var i = 0; i < TIMES; i++) {
  packed = msgpack5.encode(obj);
  unpacked = msgpack5.decode(packed);
}
console.timeEnd('msgpack5');

console.time('msgpack');
for (var i = 0; i < TIMES; i++) {
  packed = msgpack.pack(obj);
  unpacked = msgpack.unpack(packed);
}
console.timeEnd('msgpack');

console.time('msgpack-lite');
for (var i = 0; i < TIMES; i++) {
  packed = msgpackLite.encode(obj);
  unpacked = msgpackLite.decode(packed);
}
console.timeEnd('msgpack-lite');

console.time('msgpack-js');
for (var i = 0; i < TIMES; i++) {
  packed = msgpackjs.encode(obj);
  unpacked = msgpackjs.decode(packed);
}
console.timeEnd('msgpack-js');

