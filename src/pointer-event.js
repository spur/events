var core = require('./core.js');
var pointerTypes = core.pointerTypes;
var MOUSE_IDENTIFIER = core.mouseIdentifier;

function PointerEvent(type) {
  this.pointerId = 0;
  this.pointerType = '';
  this.width = 0;
  this.height = 0;
  this.pressure = 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = false;

  this.path = null;

  this.clientX = 0;
  this.clientY = 0;
  this.screenX = 0;
  this.screenY = 0;
  this.type = type;
  this.target = null;

  this.originalEvent = null;

  // internal
  this._propagationStopped = false;
}

PointerEvent.prototype.preventDefault = function () {
  this.originalEvent.preventDefault();
};

PointerEvent.prototype.stopPropagation = function () {
  this._propagationStopped = true;
};


PointerEvent.prototype._initFromMouse = function (event, type) {
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

PointerEvent.prototype._initFromTouch = function (event, touch, type, isPrimary) {
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

PointerEvent.prototype._initFromPointer = function (event) {
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
