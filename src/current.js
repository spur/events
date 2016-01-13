var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var pointers = {};
var pointerObjects = {};
var downPointers = { pointers: pointers, count: 0 };
var primaryTouch = { x: 0, y: 0, timeStamp: 0 };

function addPointer(pointerId, pointerType, x, y, target) {
  var pointerObject = getPointerObject();
  var pointerEvent = pointerObject.event;
  pointerEvent.pointerType = pointerType;
  pointerEvent.clientX = x;
  pointerEvent.clientY = y;
  pointerEvent.target = target;
  pointers[pointerId] = pointerEvent;
  pointerObjects[pointerId] = pointerObject;
  downPointers.count += 1;
}

function updatePointer(pointerId, x, y, target) {
  var pointer = pointers[pointerId];
  if (!pointer) { return; }
  pointer.clientX = x;
  pointer.clientY = y;
  pointer.target = target;
}

function removePointer(pointerId) {
  delete pointers[pointerId];
  releasePointerObject(pointerObjects[pointerId]);
  delete pointerObjects[pointerId];
  downPointers.count -= 1;
}

module.exports = {
  downPointers: downPointers,
  addPointer: addPointer,
  updatePointer: updatePointer,
  removePointer: removePointer,
  primaryTouch: primaryTouch
};
