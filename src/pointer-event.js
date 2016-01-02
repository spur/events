var core = require('./core.js');
var pointerTypes = core.pointerTypes;
var MOUSE_IDENTIFIER = core.mouseIdentifier;

function PointerEvent() {
  this.pointerId = null;
  this.pointerType = '';
  this.width = 0;
  this.height = 0;
  this.pressure = 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = false;

  this.clientX = null;
  this.clientY = null;
  this.screenX = null;
  this.screenY = null;
  this.type = null;
  this.target = null;

  this.originalEvent = null;

  // internal
  this.propagationStopped = false;
}

PointerEvent.prototype.preventDefault = function () {
  this.originalEvent.preventDefault();
};

PointerEvent.prototype.stopPropagation = function () {
  this.propagationStopped = true;
};


PointerEvent.prototype.initFromMouse = function (event, type) {
  this.pointerId = MOUSE_IDENTIFIER;
  this.pointerType = pointerTypes.mouse;
  this.width = 0;
  this.height = 0;
  this.pressure = 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = true;

  this.clientX = event.clientX;
  this.clientY = event.clientY;
  this.screenX = event.screenX;
  this.screenY = event.screenY;
  this.type = type;
  this.target = event.target;

  this.originalEvent = event;
  return this;
}

PointerEvent.prototype.initFromTouch = function (event, touch, type, isPrimary) {
  this.pointerId = touch.identifier;
  this.pointerType = pointerTypes.touch;
  this.width = touch.radiusX || touch.webkitRadiusX || 0;
  this.height = touch.radiusY || touch.webkitRadiusY || 0;
  this.pressure = touch.force || touch.webkitForce || 1;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = isPrimary;

  this.clientX = touch.clientX;
  this.clientY = touch.clientY;
  this.screenX = touch.screenX;
  this.screenY = touch.screenY;
  this.type = type;
  this.target = touch.target;

  this.originalEvent = event;
  return this;
}

PointerEvent.prototype.initFromPointer = function (event) {
  this.pointerId = event.pointerId;
  this.pointerType = event.pointerType;
  this.width = event.width;
  this.height = event.height;
  this.pressure = event.pressure;
  this.tiltX = event.tiltX;
  this.tiltY = event.tiltY;
  this.isPrimary = event.isPrimary;

  this.clientX = event.clientX;
  this.clientY = event.clientY;
  this.screenX = event.screenX;
  this.screenY = event.screenY;
  this.type = event.type;
  this.target = event.target;

  this.originalEvent = event;
  return this;
}

module.exports = PointerEvent;
