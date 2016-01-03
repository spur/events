var pointers = require('./src/current.js').pointers;
var domAPI = require('./src/dom-api.js');
var CustomPointerEvent = require('./src/pointer-event.js');

if (window.PointerEvent) {
  require('./src/pointer.js');
} else {
  require('./src/touch.js');
  require('./src/mouse.js');
}

module.exports = {
  pointers: pointers,
  PointerEvent: CustomPointerEvent,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener,
  removeListenerById: domAPI.removeListenerById,
  removeAllListeners: domAPI.removeAllListeners,
  dispatchEvent: domAPI.dispatch
};
