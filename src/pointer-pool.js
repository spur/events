var PointerEvent = require('./pointer-event.js');
var INITIAL_LIST_SIZE = 5;
var poolSize = 0;

function createPoolEntry(pointerEvent) {
  poolSize += 1;
  return {
    event: pointerEvent || new PointerEvent(),
    next: null
  }
}

var first, last;

function addPoolEntry(entry) {
  if (!last) {
    first = last = entry;
  } else {
    last.next = entry;
    last = entry;
  }

  entry.next = null;
}

function getPointerObject() {
  if (!first) {
    addPoolEntry(createPoolEntry());
  }

  var entry = first;
  first = entry.next;
  if (last === entry) { last = first; }
  return entry;
}

function releasePointerObject(entry) {
  entry.event.originalEvent = null;
  addPoolEntry(entry);
}

for (var i = 0; i < INITIAL_LIST_SIZE; i += 1) {
  addPoolEntry(createPoolEntry());
}

module.exports = {
  getPointerObject: getPointerObject,
  releasePointerObject: releasePointerObject
};
