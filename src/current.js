var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var pointers = {};
var pointerObjects = {};
var downPointers = { pointers: pointers, count: 0 };

function addPointer(pointerId, pointerType, x, y, target) {
  var pointerObject = getPointerObject();
  var event = pointerObject.event;
  event.pointerType = pointerType;
  event.clientX = x;
  event.clientY = y;
  event.target = target;
  pointers[pointerId] = event;
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
  touchPrimaryId: null
};
