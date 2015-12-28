var core = require('./core.js');
var domAPI = require('./dom-api.js');

if (window.PointerEvent) {
  require('./pointer.js');
} else {
  require('./touch.js');
  require('./mouse.js');
}

module.exports = {
  pointers: core.pointers,
  addListener: domAPI.addListener,
  removeListener: domAPI.removeListener
};
