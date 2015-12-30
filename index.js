var pointers = require('./current.js').pointers;
var domAPI = require('./dom-api.js');

if (window.PointerEvent) {
  require('./pointer.js');
} else {
  require('./touch.js');
  require('./mouse.js');
}

module.exports = {
  pointers: pointers,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener
};
