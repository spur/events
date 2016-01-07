var downPointers = require('./src/current.js').downPointers;
var domAPI = require('./src/dom-api.js');
var CustomPointerEvent = require('./src/pointer-event.js');

if (window.PointerEvent) {
  require('./src/pointer.js');
} else {
  require('./src/touch.js');
  require('./src/mouse.js');
}

module.exports = {
  downPointers: downPointers,
  PointerEvent: CustomPointerEvent,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener,
  removeListenerById: domAPI.removeListenerById,
  removeAllListeners: domAPI.removeAllListeners,
  dispatchEvent: domAPI.dispatch
};
