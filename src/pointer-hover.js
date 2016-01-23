var getPath = require('./utils.js').getPath;
var pointerEventTypes = require('./core.js').pointerEventTypes;

var domAPI = require('./dom-api.js');
var dispatchEventOn = domAPI.dispatchEventOn;
var hasListener = domAPI.hasListener;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var enteringElement = null;
var enteringPath = [];
var enteringIndex;
var leavingElement = null;
var leavingPath = [];
var leavingIndex;

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

function handleLeaveEvent(e, eventInitMethod)  {
  if (!hasListener(pointerEventTypes.leave)) { return; }
  updateTargets(e.relatedTarget, e.target);

  var pointerObject = getPointerObject();
  var event = pointerObject.event[eventInitMethod](e, pointerEventTypes.leave);
  event.target = leavingPath[0];
  for (var i = 0; i <= leavingIndex; i += 1) {
    dispatchEventOn(event, leavingPath[i]);
  }

  releasePointerObject(pointerObject);
}

function handleEnterEvent(e, eventInitMethod) {
  if (!hasListener(pointerEventTypes.enter)) { return; }
  updateTargets(e.target, e.relatedTarget);

  var pointerObject = getPointerObject();
  var event = pointerObject.event[eventInitMethod](e, pointerEventTypes.enter);
  event.target = enteringPath[0];
  for (var i = 0; i <= enteringIndex; i += 1) {
    dispatchEventOn(event, enteringPath[i]);
  }

  releasePointerObject(pointerObject);
}

module.exports = {
  handleEnterEvent: handleEnterEvent,
  handleLeaveEvent: handleLeaveEvent
}