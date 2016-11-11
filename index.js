var domAPI = require('./src/dom-api.js');
var events = require('./src/events.js');

var pointer, touch, mouse;
if (window.PointerEvent) {
  pointer = require('./src/pointer.js');
} else {
  touch = require('./src/touch.js');
  mouse = require('./src/mouse.js');
}

function setupBaseNode(node) {
  if (window.PointerEvent) {
    pointer.setupBaseNode(node);
  } else {
    touch.setupBaseNode(node);
    mouse.setupBaseNode(node);
  }
}

module.exports = {
  PointerEvent: events.PointerEvent,
  SpurEvent: events.SpurEvent,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener,
  removeListenerById: domAPI.removeListenerById,
  removeAllListeners: domAPI.removeAllListeners,
  dispatchEvent: domAPI.dispatch,
  setupBaseNode: setupBaseNode
};
