var pointerEventTypes = require('./core.js').pointerEventTypes;
var releasePointerObject = require('./pointer-pool.js').releasePointerObject;

var ATTRIBUTE_NAME = 'data-pointer-id';
var idIncrement = 1;
var listeners = {};
for (var key in pointerEventTypes) {
  var type = pointerEventTypes[key];
  listeners[type] = { count: 0, map: {} };
}

function hasListener(eventType) {
  return listeners[eventType].count > 0;
}

function dispatchEventOnElement(element, typeMap) {
  var id = element.getAttribute(ATTRIBUTE_NAME);
  var entry = id && typeMap.map[id];
  if (entry) {
    var registeredListeners = entry.listeners;
    for (var i = 0, len = registeredListeners.length; i < len; i += 1) {
      var listenerEntry = registeredListeners[i];
      listenerEntry.listener.call(listenerEntry.context || element, event);
    }
  }
}

function dispatchEventOn(event) {
  var typeMap = listeners[event.type];
  var element = event.target;
  dispatchEventOnElement(element, typeMap);
}

function dispatchEvent(event) {
  event.propagationStopped = false;

  var typeMap = listeners[event.type];
  var element = event.target;
  while (element !== null) {
    dispatchEventOnElement(element, typeMap);

    if (event.propagationStopped) { break; }
    element = element.parentElement;
  }
}

function getDOMNodeId(element) {
  var id = element.getAttribute(ATTRIBUTE_NAME);
  if (!id) {
    id = idIncrement;
    idIncrement += 1;
    element.setAttribute(ATTRIBUTE_NAME, id);
  }
  return id;
}

var addListener = function (element, type, listener, options) {
  var typeMap = listeners[type];
  var id = getDOMNodeId(element);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) {
    typeEntry = typeMap.map[id] = { element: element, listeners: [] };
    typeMap.count += 1;
  }

  options = options || {};
  typeEntry.listeners.push({ listener: listener, context: options.context });
};

var removeListener = function (element, type, listener) {
  var typeMap = listeners[type];
  var id = getDOMNodeId(element);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) { return console.error('unregistered element', element, type); }
  var registeredListeners = typeEntry.listeners;

  var listenerIndex = -1;
  for (var i = 0; i < registeredListeners.length; i += 1) {
    if (registeredListeners[i].listener === listener) {
      listenerIndex = i;
      break;
    }
  }

  if (listenerIndex === -1) { return console.error('unregistered listener', element, type); }
  registeredListeners.splice(listenerIndex, 1);

  if (registeredListeners.length === 0) {
    delete typeMap.map[id];
    typeMap.count -= 1;
  }
};

EventTarget.prototype.addListener = function (type, listener, options) {
  addListener(this, type, listener, options);
};

EventTarget.prototype.removeListener = function (type, listener) {
  removeListener(this, type, listener);
};

var addListenerById = function (element, type, id, listener) {

};

var removeListenerById = function (element, type, id) {

};

export {
  hasListener,
  dispatchEvent,
  dispatchEventOn,
  addListener,
  removeListener
}
