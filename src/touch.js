var core = require('./core.js');
var touchType = core.pointerTypes.touch;
var pointerEventTypes = core.pointerEventTypes;

var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;

var hover = require('./hover.js');
var PointerEvent = require('./pointer-event.js');

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var currentPointers = require('./current.js');
var addPointer = currentPointers.addPointer;
var updatePointer = currentPointers.updatePointer;
var removePointer = currentPointers.removePointer;

PointerEvent.prototype.initFromTouch = function (event, touch, type) {
  this.pointerId = touch.identifier;
  this.pointerType = touchType;
  this.x = touch.clientX;
  this.y = touch.clientY;
  this.target = touch.target;
  this.originalEvent = event;
  this.type = type;
  return this;
}

window.addEventListener('touchstart', function (e) {
  e.preventDefault();

  hover.start(e);

  var hasListener = domAPI.hasListener(pointerEventTypes.down);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    addPointer(touch.identifier, touchType, touch.clientX, touch.clientY, touch.target);

    if (hasListener) {
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.down);
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
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.move);
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
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.up);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);
}, true);

window.addEventListener('touchcancel', function (e) {
  var hasListener = domAPI.hasListener(pointerEventTypes.cancel);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    removePointer(touch.identifier);

    if (hasListener) {
      pointerEvent.initFromTouch(e, touch, pointerEventTypes.cancel);
      dispatchEvent(pointerEvent);
    }
  }
  releasePointerObject(pointerObject);

  hover.end(e);
}, true);
