var core = require('./core.js');
var pointerEventTypes = core.pointerEventTypes;
var EventPhase = core.EventPhase;
var getPath = require('./utils.js').getPath;
var releasePointerObject = require('./pointer-pool.js').releasePointerObject;
var getDOMNodeId = require('spur-id').getDOMNodeId;

var listeners = {};
for (var key in pointerEventTypes) {
  var type = pointerEventTypes[key];
  listeners[type] = { count: 0, map: {} };
}

function hasListener(eventType) {
  return listeners[eventType].count > 0;
}

function dispatchEventOnElement(element, typeMap, event, capturePhase, noPhase) {
  var id = getDOMNodeId(element);
  var entry = id && typeMap.map[id];
  if (!entry) { return; }

  event.currentTarget = element;
  var registeredListeners = entry.listeners;
  for (var i = 0, len = registeredListeners.length; i < len; i += 1) {
    var listenerEntry = registeredListeners[i];
    if (noPhase || capturePhase === listenerEntry.capture) {
      listenerEntry.listener.call(listenerEntry.context || element, event);
    }
    if (event.immediatePropagationStopped) { break; }
  }
}

function resetEvent(event) {
  event.path = null;
  event.timeStamp = 0;
  event.currentTarget = null;
  event.eventPhase = EventPhase.NONE;
}

function dispatchEventOn(event, target) {
  var typeMap = listeners[event.type];
  var element = target || event.target || document;
  event.path = null;
  event.timeStamp = event.timeStamp || Date.now();
  event.eventPhase = EventPhase.NONE;
  dispatchEventOnElement(element, typeMap, event, false, true);

  resetEvent(event);
}

function dispatchEvent(event) {
  var typeMap = listeners[event.type];
  event.target = event.target || document;
  var path = event.path || getPath(event.target);

  event.propagationStopped = false;
  event.immediatePropagationStopped = false;
  event.defaultPrevented = false;
  event.path = path;
  event.timeStamp = Date.now();

  event.eventPhase = EventPhase.CAPTURING_PHASE;
  for (var i = path.length - 1; i > 0; i -= 1) {
    var element = path[i];
    dispatchEventOnElement(element, typeMap, event, true);
    if (event.propagationStopped) { return resetEvent(event); }
  }

  if (path.length > 1) {
    event.eventPhase = EventPhase.AT_TARGET;
    dispatchEventOnElement(event.target, typeMap, event, true);
    dispatchEventOnElement(event.target, typeMap, event, false);
  }

  if (!event.bubbles) { return resetEvent(event); }

  event.eventPhase = EventPhase.BUBBLING_PHASE;
  for (var i = 1; i < path.length; i += 1) {
    var element = path[i];
    dispatchEventOnElement(path[i], typeMap, event, false);
    if (event.propagationStopped) { return resetEvent(event); }
  }

  resetEvent(event);
}

function getTypeEntry(element, type, create) {
  var typeMap = listeners[type];
  if (!typeMap) {
    typeMap = listeners[type] = { count: 0, map: {} };
  }

  var id = getDOMNodeId(element);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) {
    typeEntry = typeMap.map[id] = { element: element, listeners: [], ids: {} };
    typeMap.count += 1;
  }
  return typeEntry;
}

var addListener = function (element, type, listener, options) {
  var typeMap = listeners[type];
  if (!typeMap) {
    typeMap = listeners[type] = { count: 0, map: {} };
  }

  var id = getDOMNodeId(element, true);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) {
    typeEntry = typeMap.map[id] = { element: element, listeners: [], ids: {} };
    typeMap.count += 1;
  }

  options = options || {};
  var listenerEntry = { listener: listener, context: options.context, capture: options.capture || false };
  typeEntry.listeners.push(listenerEntry);
  if (options.hasOwnProperty('id')) {
    typeEntry.ids[options.id] = listenerEntry;
  }
};


var removeListener = function (element, type, listener, options) {
  var typeMap = listeners[type];
  if (!typeMap) { return; }

  var id = getDOMNodeId(element);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) { return; }

  options = options || {};
  var capturePhase = options.capture || false;
  var context = options.context;
  var registeredListeners = typeEntry.listeners;

  var listenerIndex = -1;
  var newListenerList = [];
  for (var i = 0; i < registeredListeners.length; i += 1) {
    var listenerEntry = registeredListeners[i];
    if ((listenerEntry.listener !== listener) || (listenerEntry.capture !== capturePhase) || (listenerEntry.context !== context)) {
      newListenerList.push(listenerEntry);
    }
  }

  if (newListenerList.length === 0) {
    delete typeMap.map[id];
    typeMap.count -= 1;
  } else {
    typeEntry.listeners = newListenerList;
  }
};


var removeListenerById = function (element, type, listenerId) {
  var typeMap = listeners[type];
  if (!typeMap) { return; }

  var id = getDOMNodeId(element);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) { return; }

  var listenerEntry = typeEntry.ids[listenerId];
  if (!listenerEntry) { return; }

  var entryIndex = typeEntry.listeners.indexOf(listenerEntry);
  if (entryIndex === -1) { return; }

  typeEntry.listeners.splice(entryIndex, 1);
  if (typeEntry.listeners.length === 0) {
    delete typeMap.map[id];
    typeMap.count -= 1;
  }
};

var removeAllListeners = function (element, type) {
  var typeMap = listeners[type];
  if (!typeMap) { return; }

  var id = getDOMNodeId(element);
  var typeEntry = typeMap.map[id];
  if (!typeEntry) { return; }

  delete typeMap.map[id];
  typeMap.count -= 1;
};

var dispatch = function (pointerEvent) {
  if (!pointerEvent.type) {
    throw new Error('InvalidStateError, you must specify a valid event type');
  }

  if (!listeners[pointerEvent.type]) { return; }

  if (pointerEvent.type === pointerEventTypes.enter || pointerEvent.type === pointerEventTypes.leave) {
    dispatchEventOn(pointerEvent);
  } else {
    dispatchEvent(pointerEvent);
  }
};

module.exports = {
  hasListener: hasListener,
  dispatch: dispatch,
  dispatchEvent: dispatchEvent,
  dispatchEventOn: dispatchEventOn,
  addListener: addListener,
  removeListener: removeListener,
  removeListenerById: removeListenerById,
  removeAllListeners: removeAllListeners
};
