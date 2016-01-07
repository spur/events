var pointerPool = require('./pointer-pool.js');
var getPointerObject = pointerPool.getPointerObject;
var releasePointerObject = pointerPool.releasePointerObject;

var pointers = {};
var pointerObjects = {};

function addPointer(pointerId, pointerType, x, y, target) {
  var pointerObject = getPointerObject();
  var event = pointerObject.event;
  event.pointerType = pointerType;
  event.x = x;
  event.y = y;
  event.target = target;
  pointers[pointerId] = event;
  pointerObjects[pointerId] = pointerObject;
}

function updatePointer(pointerId, x, y, target) {
  var pointer = pointers[pointerId];
  if (!pointer) { return; }
  pointer.x = x;
  pointer.y = y;
  pointer.target = target;
}

function removePointer(pointerId) {
  delete pointers[pointerId];
  releasePointerObject(pointerObjects[pointerId]);
  delete pointerObjects[pointerId];
}

module.exports = {
  pointers: pointers,
  addPointer,
  updatePointer,
  removePointer,
  touchPrimaryId: null
};
