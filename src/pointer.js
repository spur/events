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

var baseNode = window;

function handleNativePointer(e) {
  if (!hasListener(e.type)) { return; }
  var pointerObject = getPointerObject();
  pointerObject.event._initFromPointer(e);
  dispatchEvent(pointerObject.event);
  releasePointerObject(pointerObject);
}

window.setTimeout(function() {
  baseNode.addEventListener('pointerdown', handleNativePointer, true);
  baseNode.addEventListener('pointermove', handleNativePointer, true);
  baseNode.addEventListener('pointerup', handleNativePointer, true);
  baseNode.addEventListener('pointercancel', handleNativePointer, true);

  baseNode.addEventListener('pointerout', function (e) {
    handleNativePointer(e, pointerEventTypes.out);
    handleLeaveEvent(e, '_initFromPointer');
  }, true);

  baseNode.addEventListener('pointerover', function (e) {
    handleNativePointer(e, pointerEventTypes.over);
    handleEnterEvent(e, '_initFromPointer');
  }, true);
}, 0);

module.exports = {
  setupBaseNode: function(node) {
    baseNode = node;
  }
};
