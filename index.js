var domAPI = require('./src/dom-api.js');
var events = require('./src/events.js');

if (window.PointerEvent) {
  require('./src/pointer.js');
} else {
  require('./src/touch.js');
  require('./src/mouse.js');
}

module.exports = {
  PointerEvent: events.PointerEvent,
  SpurEvent: events.SpurEvent,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener,
  removeListenerById: domAPI.removeListenerById,
  removeAllListeners: domAPI.removeAllListeners,
  dispatchEvent: domAPI.dispatch
};
