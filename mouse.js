var core = require('./core.js');
var mouseType = core.pointerTypes.mouse;
var pointerEventTypes = core.pointerEventTypes;

var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;
var dispatchEventOn = domAPI.dispatchEventOn;
var hasListener = domAPI.hasListener;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var currentPointers = require('./current.js');
var addPointer = currentPointers.addPointer;
var updatePointer = currentPointers.updatePointer;
var removePointer = currentPointers.removePointer;

var PointerEvent = require('./pointer-event.js');

var getPath = require('./utils.js').getPath;

var MOUSE_IDENTIFIER = 'mouse-pointer-identifier';

var enteringElement = null;
var enteringPath = [];
var enteringIndex;
var leavingElement = null;
var leavingPath = [];
var leavingIndex;

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

function updateTargets(enterTarget, leaveTarget) {
  if (leavingElement !== leaveTarget) {
    leavingElement = leaveTarget;
    leavingPath = getPath(leavingElement);
  }

  if (enteringElement !== enterTarget) {
    enteringElement = enterTarget;
    enteringPath = getPath(enteringElement);
  }

  leavingIndex = leavingPath.length - 1;
  enteringIndex = enteringPath.length - 1;
  while (enteringIndex > 1 || leavingIndex > 1) {
    if (leavingPath[leavingIndex] !== enteringPath[enteringIndex]) { break; }
    enteringIndex -= 1;
    leavingIndex -= 1;
  }
}

function handleLeaveEvent(e)  {
  updateTargets(e.relatedTarget, e.target);

  var pointerObject = getPointerObject();
  pointerObject.event.initFromMouse(e, pointerEventTypes.leave);
  for (var i = 0; i < leavingIndex; i += 1) {
    var element = leavingPath[i];
    pointerObject.event.target = element;
    dispatchEventOn(pointerObject.event)
  }

  releasePointerObject(pointerObject);
}

function handleEnterEvent(e) {
  updateTargets(e.target, e.relatedTarget);

  var pointerObject = getPointerObject();
  pointerObject.event.initFromMouse(e, pointerEventTypes.enter);
  for (var i = 0; i < enteringIndex; i += 1) {
    var element = enteringPath[i];
    pointerObject.event.target = element;
    dispatchEventOn(pointerObject.event)
  }
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

window.addEventListener('mouseout', function (e) {
  handleEvent(e, pointerEventTypes.out);

  if (hasListener(pointerEventTypes.leave)) {
    handleLeaveEvent(e);
  }
}, true);

window.addEventListener('mouseover', function (e) {
  handleEvent(e, pointerEventTypes.over);

  if (hasListener(pointerEventTypes.enter)) {
    handleEnterEvent(e);
  }
}, true);

