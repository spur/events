var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;
var hasListener = domAPI.hasListener;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var currentPointers = require('./current.js');
var addPointer = currentPointers.addPointer;
var updatePointer = currentPointers.updatePointer;
var removePointer = currentPointers.removePointer;


var events = [
  'pointerenter',
  'pointerleave',
  'pointerout',
  'pointerover',
  'pointercancel'
];

function handleNativePointer(e) {
  if (!hasListener(e.type)) { return; }
  var pointerObject = getPointerObject();
  pointerObject.event._initFromPointer(e);
  dispatchEvent(pointerObject.event);
  releasePointerObject(pointerObject);
}

window.addEventListener('pointerdown', function (e) {
  addPointer(e.pointerId, e.pointerType, e.clientX, e.clientY, e.target);
  handleNativePointer(e);
}, true);

window.addEventListener('pointermove', function (e) {
  updatePointer(e.pointerId, e.clientX, e.clientY, e.target);
  handleNativePointer(e);
}, true);

window.addEventListener('pointerup', function (e) {
  removePointer(e.pointerId);
  handleNativePointer(e);
}, true);

for (var i = 0; i < events.length; i += 1) {
  window.addEventListener(events[i], handleNativePointer, true);
}
