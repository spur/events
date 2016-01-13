var core = require('./core.js');
var mouseType = core.pointerTypes.mouse;
var MOUSE_IDENTIFIER = core.mouseIdentifier;
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

var getPath = require('./utils.js').getPath;

var SIMULATED_DISTANCE = 10;
var SIMULATED_MAX_TIME = 500;

var enteringElement = null;
var enteringPath = [];
var enteringIndex;
var leavingElement = null;
var leavingPath = [];
var leavingIndex;

function handleEvent(e, pointerEventType) {
  if (!hasListener(pointerEventType)) { return }
  var pointerObject = getPointerObject();
  pointerObject.event._initFromMouse(e, pointerEventType);
  dispatchEvent(pointerObject.event);
  releasePointerObject(pointerObject);
}

function isEventEmulated(e) {
  var primaryTouch = currentPointers.primaryTouch;
  if (primaryTouch.timeStamp === 0) { return false; } // no touch events;

  if (e.timeStamp === 0) { return true; } // safari's simulated mouse events have a 0 timestamp.

  if (e.sourceCapabilities) { return e.sourceCapabilities.firesTouchEvents; } // chrome

  // ignore the mouse event if there was a touch around the same time and coordinates.
  if (e.timeStamp - primaryTouch.timeStamp > SIMULATED_MAX_TIME) { return false; }
  return (Math.abs(primaryTouch.x - e.clientX) <= SIMULATED_DISTANCE) && (Math.abs(primaryTouch.y - e.clientY) <= SIMULATED_DISTANCE);
}

function updateTargets(enterTarget, leaveTarget) {
  if (leavingElement !== leaveTarget) {
    leavingElement = leaveTarget;
    leavingPath = leavingElement === enteringElement ? enteringPath : getPath(leavingElement);
  }

  if (enteringElement !== enterTarget) {
    enteringElement = enterTarget;
    enteringPath = getPath(enteringElement);
  }

  enteringIndex = enteringPath.length;
  leavingIndex = leavingPath.length;
  for (; enteringIndex >= 0 && leavingIndex >= 0; enteringIndex -= 1, leavingIndex -= 1) {
    if (enteringPath[enteringIndex] !== leavingPath[leavingIndex]) { break; }
  }
}


function handleLeaveEvent(e)  {
  updateTargets(e.relatedTarget, e.target);

  var pointerObject = getPointerObject();
  var event = pointerObject.event._initFromMouse(e, pointerEventTypes.leave);
  for (var i = 0; i <= leavingIndex; i += 1) {
    event.target = leavingPath[i];
    dispatchEventOn(event);
  }

  releasePointerObject(pointerObject);
}

function handleEnterEvent(e) {
  updateTargets(e.target, e.relatedTarget);

  var pointerObject = getPointerObject();
  var event = pointerObject.event._initFromMouse(e, pointerEventTypes.enter);
  for (var i = 0; i <= enteringIndex; i += 1) {
    event.target = enteringPath[i];
    dispatchEventOn(event)
  }

  releasePointerObject(pointerObject);
}

window.addEventListener('mousedown', function (e) {
  if (isEventEmulated(e)) { return; }
  addPointer(MOUSE_IDENTIFIER, mouseType, e.clientX, e.clientY, e.target);
  handleEvent(e, pointerEventTypes.down);
}, true);

window.addEventListener('mousemove', function (e) {
  if (isEventEmulated(e)) { return; }
  updatePointer(MOUSE_IDENTIFIER, e.clientX, e.clientY, e.target);
  handleEvent(e, pointerEventTypes.move);
}, true);

window.addEventListener('mouseup', function (e) {
  if (isEventEmulated(e)) { return; }
  removePointer(MOUSE_IDENTIFIER);
  handleEvent(e, pointerEventTypes.up);
}, true);

window.addEventListener('mouseout', function (e) {
  if (isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.out);

  if (hasListener(pointerEventTypes.leave)) {
    handleLeaveEvent(e);
  }
}, true);

window.addEventListener('mouseover', function (e) {
  if (isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.over);

  if (hasListener(pointerEventTypes.enter)) {
    handleEnterEvent(e);
  }
}, true);

