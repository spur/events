var pointers = require('./src/current.js').pointers;
var domAPI = require('./src/dom-api.js');

if (window.PointerEvent) {
  require('./src/pointer.js');
} else {
  require('./src/touch.js');
  require('./src/mouse.js');
}

module.exports = {
  pointers: pointers,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener
};
