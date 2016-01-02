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
  e.preventDefault();

  primaryId = e.touches[0].identifier;

  hover.start(e, primaryId);

  var hasListener = domAPI.hasListener(pointerEventTypes.down);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    addPointer(touch.identifier, touchType, touch.clientX, touch.clientY, touch.target);

    if (hasListener) {
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.down, touch.identifier === primaryId);
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
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.move, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);

window.addEventListener('touchend', function (e) {
  hover.end(e);

  var hasListener = domAPI.hasListener(pointerEventTypes.up);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    removePointer(touch.identifier);

    if (hasListener) {
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.up, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);

window.addEventListener('touchcancel', function (e) {
  var hasListener = domAPI.hasListener(pointerEventTypes.cancel);
  primaryId = e.touches[0].identifier;
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    removePointer(touch.identifier);

    if (hasListener) {
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.cancel, touch.identifier === primaryId);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);

  hover.end(e, primaryId);
}, true);
