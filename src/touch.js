var core = require('./core.js');
var touchType = core.pointerTypes.touch;
var pointerEventTypes = core.pointerEventTypes;

var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;

var hover = require('./hover.js');

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var currentPointers = require('./current.js');
var addPointer = currentPointers.addPointer;
var updatePointer = currentPointers.updatePointer;
var removePointer = currentPointers.removePointer;

var primaryId = null;

window.addEventListener('touchstart', function (e) {
  primaryId = currentPointers.touchPrimaryId = e.touches[0].identifier;

  hover.start(e, primaryId);

  var hasListener = domAPI.hasListener(pointerEventTypes.down);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    addPointer(touch.identifier, touchType, touch.clientX, touch.clientY, touch.target);

    if (hasListener) {
      pointerEvent._initFromTouch(e, touch, pointerEventTypes.down, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);

window.addEventListener('touchmove', function (e) {
  hover.move(e);

  var hasListener = domAPI.hasListener(pointerEventTypes.move);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    updatePointer(touch.identifier, touch.clientX, touch.clientY, touch.target);

    if (hasListener) {
      pointerEvent._initFromTouch(e, touch, pointerEventTypes.move, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);

window.addEventListener('touchend', function (e) {
  primaryId = currentPointers.touchPrimaryId = e.touches.length && e.touches[0].identifier;
  hover.end(e, primaryId);

  var hasListener = domAPI.hasListener(pointerEventTypes.up);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    removePointer(touch.identifier);

    if (hasListener) {
      pointerEvent._initFromTouch(e, touch, pointerEventTypes.up, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);

window.addEventListener('touchcancel', function (e) {
  primaryId = currentPointers.touchPrimaryId = e.touches.length && e.touches[0].identifier;
  hover.end(e, primaryId);

  var hasListener = domAPI.hasListener(pointerEventTypes.cancel);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    removePointer(touch.identifier);

    if (hasListener) {
      pointerEvent._initFromTouch(e, touch, pointerEventTypes.cancel, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);
