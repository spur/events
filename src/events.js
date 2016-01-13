var core = require('./core.js');
var pointerTypes = core.pointerTypes;
var MOUSE_IDENTIFIER = core.mouseIdentifier;

function SpurEvent(type) {
  this.clientX = 0;
  this.clientY = 0;
  this.screenX = 0;
  this.screenY = 0;
  this.pageX = 0;
  this.pageY = 0;
  this.type = type;
  this.timeStamp = 0;

  this.target = null;
  this.currentTarget = null;
  this.relatedTarget = null;

  this.path = null;
  this.bubbles = true;
  this.eventPhase = Event.NONE;
  this.defaultPrevented = false;

  this.propagationStopped = false;
  this.immediatePropagationStopped = false;
}

SpurEvent.prototype.preventDefault = function () {
  this.defaultPrevented = true;

  if (this.originalEvent) {
    this.originalEvent.preventDefault();
  }
};

SpurEvent.prototype.stopPropagation = function () {
  this.propagationStopped = true;
};

SpurEvent.prototype.stopImmediatePropagation = function () {
  this.immediatePropagationStopped = true;
  this.stopPropagation();
};


function PointerEvent(type) {
  SpurEvent.call(this, type);
  this.pointerId = 0;
  this.pointerType = '';
  this.width = 0;
  this.height = 0;
  this.pressure = 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = false;

  this.originalEvent = null;
}

PointerEvent.prototype = Object.create(SpurEvent.prototype, {
  constructor: {
    value: SpurEvent,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

PointerEvent.prototype._initFromMouse = function (event, type) {
  this.pointerId = MOUSE_IDENTIFIER;
  this.pointerType = pointerTypes.mouse;
  this.width = 0;
  this.height = 0;
  this.pressure = event.force || event.webkitForce || 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = true;

  this.clientX = event.clientX;
  this.clientY = event.clientY;
  this.screenX = event.screenX;
  this.screenY = event.screenY;
  this.pageX = event.pageX;
  this.pageY = event.pageY;
  this.type = type;
  this.target = event.target;
  this.relatedTarget = event.relatedTarget;

  this.originalEvent = event;
  return this;
}

PointerEvent.prototype._initFromTouch = function (event, touch, type, isPrimary) {
  this.pointerId = touch.identifier + 1; // 0 is the mouse
  this.pointerType = pointerTypes.touch;
  this.width = touch.radiusX || touch.webkitRadiusX || 0;
  this.height = touch.radiusY || touch.webkitRadiusY || 0;
  this.pressure = touch.force || touch.webkitForce || 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.isPrimary = isPrimary;

  this.clientX = touch.clientX;
  this.clientY = touch.clientY;
  this.screenX = touch.screenX;
  this.screenY = touch.screenY;
  this.pageX = touch.pageX;
  this.pageY = touch.pageY;
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
  this.pageX = event.pageX;
  this.pageY = event.pageY;
  this.type = event.type;
  this.target = event.target;
  this.relatedTarget = event.relatedTarget;

  this.originalEvent = event;
  return this;
}

module.exports = {
  PointerEvent: PointerEvent,
  SpurEvent: SpurEvent
};
