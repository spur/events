var domAPI = require('./dom-api.js');
var dispatchEvent = domAPI.dispatchEventOn;
var dispatchEventOn = domAPI.dispatchEventOn;

var pointerEventTypes = require('./core.js').pointerEventTypes;
var pointers = require('./current.js').pointers;

var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var getPath = require('./utils.js').getPath;

var pointersInfo = {};


function start(e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    var pointerObject = getPointerObject();
    pointerObject.event.initFromTouch(e, touch, pointerEventTypes.enter);
    dispatchEvent(pointerObject.event);
    releasePointerObject(pointerObject);

    var event = pointerObject.event;
    pointersInfo[touch.identifier] = {
      path: getPath(event.target),
      timeStamp: e.timeStamp,
      target: event.target,
      x: event.x,
      y: event.y
    };
  }
}

function updateTarget(pointerInfo, e, touch) {
  var target = document.elementFromPoint(pointerInfo.x, pointerInfo.y);
  if (!target || target === pointerInfo.target) { return; }

  var pointerObject = getPointerObject();
  pointerObject.event.initFromTouch(e, touch, pointerEventTypes.out);
  pointerObject.event.target = pointerInfo.target;
  dispatchEvent(pointerObject.event);

  var newPath = getPath(target);
  var oldPath = pointerInfo.path;
  var newPathIndex = newPath.length - 1;
  var oldPathIndex = oldPath.length - 1;

  while (newPathIndex > 1 || oldPathIndex > 1) {
    if (oldPath[oldPathIndex] !== newPath[newPathIndex]) { break; }
    newPathIndex -= 1;
    oldPathIndex -= 1;
  }

  pointerObject.event.initFromTouch(e, touch, pointerEventTypes.leave);
  for (var i = 0; i < oldPathIndex; i += 1) {
    var element = oldPath[i];
    pointerObject.event.target = element;
    dispatchEventOn(pointerObject.event)
  }

  pointerObject.event.initFromTouch(e, touch, pointerEventTypes.enter);
  for (var i = 0; i < newPathIndex; i += 1) {
    var element = newPath[i];
    pointerObject.event.target = element;
    dispatchEventOn(pointerObject.event)
  }

  releasePointerObject(pointerObject);
  pointerInfo.target = target;
  pointerInfo.path = newPath;
}

function move(e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    var pointerInfo = pointersInfo[touch.identifier];

    if (Math.abs(touch.clientX - pointerInfo.x) > 15 || Math.abs(touch.clientY - pointerInfo.y) > 15 || e.timeStamp - pointerInfo.timeStamp > 50) {
      pointerInfo.x = touch.clientX;
      pointerInfo.y = touch.clientY;
      updateTarget(pointerInfo, e, touch);
    }
    pointerInfo.timeStamp = e.timeStamp;
  }
}

function end(e) {
  var touches = e.changedTouches;
  var pointerObject = getPointerObject();
  for (var i = 0; i < touches.length; i += 1) {
    var touch = touches[i];
    var pointerInfo = pointersInfo[touch.identifier];

    pointerObject.event.initFromTouch(e, touch, pointerEventTypes.out);
    pointerObject.event.target = pointerInfo.target;
    dispatchEvent(pointerObject.event);

    pointerObject.event.initFromTouch(e, touch, pointerEventTypes.leave);
    for (var i = 0; i < pointerInfo.path.length; i += 1) {
      var element = pointerInfo.path[i];
      pointerObject.event.target = element;
      dispatchEventOn(pointerObject.event);
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
