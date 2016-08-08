var core = require('./core.js');
var mouseType = core.pointerTypes.mouse;
var MOUSE_IDENTIFIER = core.mouseIdentifier;
var pointerEventTypes = core.pointerEventTypes;

var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;
var hasListener = domAPI.hasListener;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var primaryTouch = require('./touch.js').primaryTouch;

var pointerHover = require('./pointer-hover.js');
var handleEnterEvent = pointerHover.handleEnterEvent;
var handleLeaveEvent = pointerHover.handleLeaveEvent;

var SIMULATED_DISTANCE = 10;
var SIMULATED_MAX_TIME = 500;

var baseNode = window;

var lastHandledEvent = {};

function handleEvent(e, pointerEventType) {
  if (!hasListener(pointerEventType)) { return }
  var pointerObject = getPointerObject();
  pointerObject.event._initFromMouse(e, pointerEventType);
  dispatchEvent(pointerObject.event);
  releasePointerObject(pointerObject);
}

function isEventEmulated(e) {
  if (primaryTouch.timeStamp === 0) { return false; } // no touch events;

  if (e.timeStamp === 0) { return true; } // safari's simulated mouse events have a 0 timestamp.

  if (e.sourceCapabilities) { return e.sourceCapabilities.firesTouchEvents; } // chrome

  // ignore the mouse event if there was a touch around the same time and coordinates.
  if (e.timeStamp - primaryTouch.timeStamp > SIMULATED_MAX_TIME) { return false; }
  return (Math.abs(primaryTouch.x - e.clientX) <= SIMULATED_DISTANCE) && (Math.abs(primaryTouch.y - e.clientY) <= SIMULATED_DISTANCE);
}

window.setTimeout(function() {
  if (baseNode === window) { return; }

  baseNode.addEventListener('mousedown', function (e) {
    lastHandledEvent[e.type] = e.timeStamp;
    if (isEventEmulated(e)) { return; }
    handleEvent(e, pointerEventTypes.down);
  }, false);

  baseNode.addEventListener('mousemove', function (e) {
    lastHandledEvent[e.type] = e.timeStamp;
    if (isEventEmulated(e)) { return; }
    handleEvent(e, pointerEventTypes.move);
  }, false);

  baseNode.addEventListener('mouseup', function (e) {
    lastHandledEvent[e.type] = e.timeStamp;
    if (isEventEmulated(e)) { return; }
    handleEvent(e, pointerEventTypes.up);
  }, false);

  baseNode.addEventListener('mouseout', function (e) {
    lastHandledEvent[e.type] = e.timeStamp;
    if (isEventEmulated(e)) { return; }
    handleEvent(e, pointerEventTypes.out);
    handleLeaveEvent(e, '_initFromMouse');
  }, false);

  baseNode.addEventListener('mouseover', function (e) {
    lastHandledEvent[e.type] = e.timeStamp;
    if (isEventEmulated(e)) { return; }
    handleEvent(e, pointerEventTypes.over);
    handleEnterEvent(e, '_initFromMouse');
  }, false);
}, 0);


window.addEventListener('mousedown', function (e) {
  if (lastHandledEvent[e.type] === e.timeStamp || isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.down);
}, false);

window.addEventListener('mousemove', function (e) {
  if (lastHandledEvent[e.type] === e.timeStamp || isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.move);
}, false);

window.addEventListener('mouseup', function (e) {
  if (lastHandledEvent[e.type] === e.timeStamp || isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.up);
}, false);

window.addEventListener('mouseout', function (e) {
  if (lastHandledEvent[e.type] === e.timeStamp || isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.out);
  handleLeaveEvent(e, '_initFromMouse');
}, false);

window.addEventListener('mouseover', function (e) {
  if (lastHandledEvent[e.type] === e.timeStamp || isEventEmulated(e)) { return; }
  handleEvent(e, pointerEventTypes.over);
  handleEnterEvent(e, '_initFromMouse');
}, false);


module.exports = {
  setupBaseNode: function(node) {
    baseNode = node;
  }
};
