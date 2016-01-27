var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;
var hasListener = domAPI.hasListener;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var pointerHover = require('./pointer-hover.js');
var handleEnterEvent = pointerHover.handleEnterEvent;
var handleLeaveEvent = pointerHover.handleLeaveEvent;

var pointerEventTypes = require('./core.js').pointerEventTypes;

function handleNativePointer(e) {
  if (!hasListener(e.type)) { return; }
  var pointerObject = getPointerObject();
  pointerObject.event._initFromPointer(e);
  dispatchEvent(pointerObject.event);
  releasePointerObject(pointerObject);
}

window.addEventListener('pointerdown', handleNativePointer, true);
window.addEventListener('pointermove', handleNativePointer, true);
window.addEventListener('pointerup', handleNativePointer, true);
window.addEventListener('pointercancel', handleNativePointer, true);

window.addEventListener('pointerout', function (e) {
  handleNativePointer(e, pointerEventTypes.out);
  handleLeaveEvent(e, '_initFromPointer');
}, true);

window.addEventListener('pointerover', function (e) {
  handleNativePointer(e, pointerEventTypes.over);
  handleEnterEvent(e, '_initFromPointer');
}, true);

