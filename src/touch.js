var core = require('./core.js');
var touchType = core.pointerTypes.touch;
var pointerEventTypes = core.pointerEventTypes;
var window = core.window;

var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;

var hover = require('./touch-hover.js');

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var primaryTouch = { x: 0, y: 0, timeStamp: 0 };
var primaryId = null;

var baseNode = window || {
  setTimeout: function () {},
  addEventListener: function () {}
};

window.setTimeout(function() {
  baseNode.addEventListener('touchstart', function (e) {
    var firstTouch = e.touches[0];
    primaryId = firstTouch.identifier;
    primaryTouch.x = firstTouch.clientX;
    primaryTouch.y = firstTouch.clientY;
    primaryTouch.timeStamp = e.timeStamp;
    hover.start(e, primaryId);

    var hasListener = domAPI.hasListener(pointerEventTypes.down);
    var touches = e.changedTouches;
    var pointerObject = getPointerObject();
    var pointerEvent = pointerObject.event;
    for (var i = 0; i < touches.length; i += 1) {
      var touch = touches[i];

      if (hasListener) {
        pointerEvent._initFromTouch(e, touch, pointerEventTypes.down, touch.identifier === primaryId);
        dispatchEvent(pointerEvent);
      }
    }
    releasePointerObject(pointerObject);
  }, true);

  baseNode.addEventListener('touchmove', function (e) {
    var pointersInfo = hover.move(e);

    var hasListener = domAPI.hasListener(pointerEventTypes.move);
    var touches = e.changedTouches;
    var pointerObject = getPointerObject();
    var pointerEvent = pointerObject.event;
    for (var i = 0; i < touches.length; i += 1) {
      var touch = touches[i];

      if (touch.identifier === primaryId) {
        primaryTouch.x = touch.clientX;
        primaryTouch.y = touch.clientY;
        primaryTouch.timeStamp = e.timeStamp;
      }

      if (hasListener) {
        pointerEvent._initFromTouch(e, touch, pointerEventTypes.move, touch.identifier === primaryId);
        var pointerInfo = pointersInfo[touch.identifier];
        pointerEvent.target = pointerInfo.target;
        pointerEvent.path = pointerInfo.path;
        dispatchEvent(pointerEvent);
      }
    }
    releasePointerObject(pointerObject);
  }, true);

  baseNode.addEventListener('touchend', function (e) {
    var firstTouch = e.touches[0];
    if (firstTouch) {
      primaryId = firstTouch.identifier;
      primaryTouch.x = firstTouch.clientX;
      primaryTouch.y = firstTouch.clientY;
      primaryTouch.timeStamp = e.timeStamp;
    }
    hover.end(e, primaryId);

    var hasListener = domAPI.hasListener(pointerEventTypes.up);
    var touches = e.changedTouches;
    var pointerObject = getPointerObject();
    var pointerEvent = pointerObject.event;
    for (var i = 0; i < touches.length; i += 1) {
      var touch = touches[i];

      if (hasListener) {
        pointerEvent._initFromTouch(e, touch, pointerEventTypes.up, touch.identifier === primaryId, true);
        dispatchEvent(pointerEvent);
      }
    }
    releasePointerObject(pointerObject);
  }, true);

  baseNode.addEventListener('touchcancel', function (e) {
    var firstTouch = e.touches[0];
    if (firstTouch) {
      primaryId = firstTouch.identifier;
      primaryTouch.x = firstTouch.clientX;
      primaryTouch.y = firstTouch.clientY;
      primaryTouch.timeStamp = e.timeStamp;
    }
    hover.end(e, primaryId);

    var hasListener = domAPI.hasListener(pointerEventTypes.cancel);
    var touches = e.changedTouches;
    var pointerObject = getPointerObject();
    var pointerEvent = pointerObject.event;
    for (var i = 0; i < touches.length; i += 1) {
      var touch = touches[i];

      if (hasListener) {
        pointerEvent._initFromTouch(e, touch, pointerEventTypes.cancel, touch.identifier === primaryId, true);
        dispatchEvent(pointerEvent);
      }
    }
    releasePointerObject(pointerObject);
  }, true);
}, 0);

module.exports = {
  primaryTouch: primaryTouch,
  setupBaseNode: function(node) {
    baseNode = node;
  }
};
