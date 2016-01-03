var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEvent;
var dispatchEventOn = domAPI.dispatchEventOn;
var hasListener = domAPI.hasListener;

var pointerEventTypes = require('./core.js').pointerEventTypes;
var pointers = require('./current.js').pointers;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var getPath = require('./utils.js').getPath;

var pointersInfo = {};
var primaryId = null;

function start(e, primaryPointerId) {
  primaryId = primaryPointerId;
  var hasOverListener = hasListener(pointerEventTypes.over);
  var hasEnterListener = hasListener(pointerEventTypes.enter);

  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    var isPrimary = touch.identifier === primaryId;

    if (hasOverListener) {
      pointerObject.event._initFromTouch(e, touch, pointerEventTypes.over, isPrimary);
      dispatchEvent(pointerObject.event);
    }

    var event = pointerObject.event;
    var pointerInfo = {
      path: getPath(event.target),
      timeStamp: e.timeStamp,
      target: event.target,
      x: event.x,
      y: event.y
    };
    pointersInfo[touch.identifier] = pointerInfo;

    if (hasEnterListener) {
      pointerObject.event._initFromTouch(e, touch, pointerEventTypes.enter, isPrimary);
      for (var j = 0; j < pointerInfo.path.length; j += 1) {
        var element = pointerInfo.path[j];
        pointerObject.event.target = element;
        dispatchEventOn(pointerObject.event);
      }
    }
  }
  releasePointerObject(pointerObject);
}

function updateTarget(pointerInfo, e, touch, isPrimary) {
  var target = document.elementFromPoint(pointerInfo.x, pointerInfo.y);
  if (!target || target === pointerInfo.target) { return; }

  var pointerObject = getPointerObject();

  if (hasListener(pointerEventTypes.out)) {
    pointerObject.event._initFromTouch(e, touch, pointerEventTypes.out, isPrimary);
    pointerObject.event.target = pointerInfo.target;
    dispatchEvent(pointerObject.event);
  }

  var newPath = getPath(target);
  var oldPath = pointerInfo.path;
  var newPathIndex = newPath.length - 1;
  var oldPathIndex = oldPath.length - 1;

  while (newPathIndex > 1 || oldPathIndex > 1) {
    if (oldPath[oldPathIndex] !== newPath[newPathIndex]) { break; }
    newPathIndex -= 1;
    oldPathIndex -= 1;
  }

  if (hasListener(pointerEventTypes.leave)) {
    pointerObject.event._initFromTouch(e, touch, pointerEventTypes.leave, isPrimary);
    for (var i = 0; i < oldPathIndex; i += 1) {
      var element = oldPath[i];
      pointerObject.event.target = element;
      dispatchEventOn(pointerObject.event)
    }
  }

  if (hasListener(pointerEventTypes.over)) {
    pointerObject.event._initFromTouch(e, touch, pointerEventTypes.over, isPrimary);
    pointerObject.event.target = target;
    dispatchEvent(pointerObject.event);
  }

  if (hasListener(pointerEventTypes.enter)) {
    pointerObject.event._initFromTouch(e, touch, pointerEventTypes.enter, isPrimary);
    for (var i = 0; i < newPathIndex; i += 1) {
      var element = newPath[i];
      pointerObject.event.target = element;
      dispatchEventOn(pointerObject.event)
    }
  }

  releasePointerObject(pointerObject);
  pointerInfo.target = target;
  pointerInfo.path = newPath;
}

function move(e) {
  if (!hasListener(pointerEventTypes.enter) &&
    !hasListener(pointerEventTypes.leave) &&
    !hasListener(pointerEventTypes.over) &&
    !hasListener(pointerEventTypes.out)) { return; }
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    var pointerInfo = pointersInfo[touch.identifier];

    if (Math.abs(touch.clientX - pointerInfo.x) > 15 || Math.abs(touch.clientY - pointerInfo.y) > 15 || e.timeStamp - pointerInfo.timeStamp > 50) {
      pointerInfo.x = touch.clientX;
      pointerInfo.y = touch.clientY;
      updateTarget(pointerInfo, e, touch, touch.identifier === primaryId);
    }
    pointerInfo.timeStamp = e.timeStamp;
  }
}

function end(e, primaryPointerId) {
  primaryId = primaryPointerId;

  var hasLeaveListener = hasListener(pointerEventTypes.leave);
  var hasOutListener = hasListener(pointerEventTypes.out);
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    var pointerInfo = pointersInfo[touch.identifier];
    var isPrimary = touch.identifier === primaryId;

    if (hasOutListener) {
      pointerObject.event._initFromTouch(e, touch, pointerEventTypes.out, isPrimary);
      pointerObject.event.target = pointerInfo.target;
      dispatchEvent(pointerObject.event);
    }

    if (hasLeaveListener) {
      pointerObject.event._initFromTouch(e, touch, pointerEventTypes.leave, isPrimary);
      for (var j = 0; j < pointerInfo.path.length; j += 1) {
        var element = pointerInfo.path[j];
        pointerObject.event.target = element;
        dispatchEventOn(pointerObject.event);
      }
    }

    delete pointersInfo[touch.identifier];
  }
  releasePointerObject(pointerObject);
}


module.exports = {
  start: start,
  move: move,
  end: end
};
