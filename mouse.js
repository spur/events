var core = require('./core.js');
var mouseType = core.pointerTypes.mouse;
var pointerEventTypes = core.pointerEventTypes;

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

var PointerEvent = require('./pointer-event.js');


var MOUSE_IDENTIFIER = 'mouse-pointer-identifier';
var events = {
  'mouseenter': pointerEventTypes.enter,
  'mouseleave': pointerEventTypes.leave,
  'mouseout': pointerEventTypes.out
};

PointerEvent.prototype.initFromMouse = function (event, type) {
  this.pointerId = MOUSE_IDENTIFIER;
  this.pointerType = mouseType;
  this.x = event.clientX;
  this.y = event.clientY;
  this.target = event.target;
  this.originalEvent = event;
  this.type = type;
  return this;
}

function handleEvent(e, pointerEventType) {
  if (!hasListener(pointerEventType)) { return }
  var pointerObject = getPointerObject();
  pointerObject.event.initFromMouse(e, pointerEventType);
  dispatchEvent(pointerObject.event);
  releasePointerObject(pointerObject);
}

window.addEventListener('mousedown', function (e) {
  addPointer(MOUSE_IDENTIFIER, mouseType, e.clientX, e.clientY, e.target);
  handleEvent(e, pointerEventTypes.down);
}, true);

window.addEventListener('mousemove', function (e) {
  updatePointer(MOUSE_IDENTIFIER, e.clientX, e.clientY, e.target);
  handleEvent(e, pointerEventTypes.move);
}, true);

window.addEventListener('mouseup', function (e) {
  removePointer(MOUSE_IDENTIFIER);
  handleEvent(e, pointerEventTypes.up);
}, true);

function addListener(mouseEventType, pointerEventType) {
  window.addEventListener(mouseEventType, function (e) {
    handleEvent(e, pointerEventType);
  }, true);
}

for (var mouseEventType in events) {
  addListener(mouseEventType, events[mouseEventType]);
}
