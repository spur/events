# Spur Events
Cross-browser &amp; cross-platform event system based on the PointerEvent API defined by the w3c specifications (http://www.w3.org/TR/pointerevents/). This library supports every major browsers (Chrome, Safari, Edge, Firefox) on every major platforms (Windows, MacOSX, Linux, Android, iOS).

This library provides you with 'touchenter', 'touchleave', 'touchover', 'touchout' events (here called 'pointerenter', 'pointerleave', 'pointerover' and 'pointerout') on touch devices.

This is not a PointerEvent polyfill since we don't use the EventTarget prototype methods 'addEventListener' and 'removeEventListener' but instead our own methods 'addListener', 'removeListener' and more. This library still offers nearly all the current PointerEvent API.


## Basic usage
```javascript
var PointerEvents = require('spur-events');
var addListener = PointerEvents.addListener;
var removeListener = PointerEvents.removeListener;

function onPointerEnter(e) {
    console.log(e.target, e.clientX, e.clientY);
}

function mount(someDOMNode) {
    addListener(someDOMNode, 'pointerenter', onPointerEnter);
}

function unmount(someDOMNode) {
    removeListener(someDOMNode, 'pointerenter', onPointerEnter);
}
```


## API

### Methods
#### addListener
`addListener(target, type, listener, options)`
Add a listener to an EventTarget instance.

**Arguments**
- `target` (*Object*): An object that implements the EventTarget interface. Usually a DOM Node, or the `window` object or the `document` object.
- `type` (*string*): The event type. It has to be one of the supported event (see below).
- `listener` (*function*): The listener function.
- `options` (*Object*):
  - `context` (*Object*): the context to call the listener with.
  - `capture = false` (*boolean*): true to listen on the capture phase.
  - `id` (*string or number*): a id to be used in combination with the `removeListenerById` method (see below).

#### removeListener
`removeListener(target, type, listener, capture)`
Remove the listeners for the specified type from an EventTarget instance.

**Arguments**
- `target` (*Object*): the TargetEvent instance to remove the listener from.
- `type` (*string*): The event type.
- `listener` (*function*): The listener function.
- `options` (*Object*):
  - `context` (*Object*): the context listener was created with.
  - `capture = false` (*boolean*): true if the listener to be removed listens on the capture phase.

#### removeListenerById
`removeListenerById(target, type, id)`
Remove a listener that was added with a specific id.

**Arguments**
- `target` (*Object*): the TargetEvent instance to remove the listener from.
- `type` (*string*): The event type.
- `id` (*string or number*): The listener id.

#### removeAllListeners
`removeAllListeners(target, type)`
Remove all listeners on the target.

**Arguments**
- `target` (*Object*): the TargetEvent instance to remove the listener from.
- `type` (*string*): The event type.


#### dispatchEvent
`dispatchEvent(event)`
Will dispatch the event throughout the DOM Model.

**Arguments**
- `event` (*PointerEvent*): a PointerEvent instance to be dispatched. The type and the target must be defined.

**Exceptions**
- `InvalidStateError` if no event type has been specified.
- `NotSupportedError` if the event type is not one of the supported pointer events.


### Event objects
For an accurate properties description, please read the specifications of the w3c for Events and PointerEvents.

#### SpurEvent
The basic event that can be used to create custom event.

```javascript
SpurEvent {
    type, // 'pointerdown', 'tap', 'drop' ...
    timeStamp,
    target,
    currentTarget,
    relatedTarget,

    clientX,
    clientY,
    screenX,
    screenY,
    pageX,
    pageY,

    path,
    bubbles,
    eventPhase,
    defaultPrevented,

    propagationStopped, // whether 'stopPropagation' has been called
    immediatePropagationStopped // whether 'stopImmediatePropagation' has been called
}
```

The `SpurEvent` object also provides the `stopPropagation`, `stopImmediatePropagation` and `preventDefault` methods.
```javascript
function onPointerEnter(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
}
```

Note that the `stopPropagation` and `stopImmediatePropagation` methods only stop the propagation of the events throughout our system. The native browser events are not impacted.
The `stopImmediatePropagation` method implicitly calls the `stopPropagation` and will stop the general propagation of the event through the DOM.
`preventDefault` calls the native `preventDefault` method on the event object hold by the `originalEvent` property.


#### PointerEvent
The PointerEvent class.
```javascript
PointerEvent : SpurEvent {
    pointerId, // an id to identify the pointer
    pointerType, // 'mouse', 'touch' or 'pen'
    width, // we use the 'radiusX' value for touch events. 0 for mouse events
    height, // we use the 'radiusY' value for touch events. 0 for mouse events
    pressure, // we use the 'force' value for touch events. 1 for mouse events
    tiltX, // 0 if the browser doesn't support Pointer Event natively
    tiltY, // 0 if the browser doesn't support Pointer Event natively
    isPrimary,

    originalEvent // original event that was used to generate this object
}
```


## Note on performance
### Event delegation
The library uses event delegation to improve performances. There is only one DOM listener for each event. On each DOM node using our API, we add a particular attribute to uniquely register it, allowing us to add and remove listeners really quickly.

### Event object pool
To avoid garbage collection, we use a pool of event object and reuse them. If you need to keep some information from those objects asynchronously, you should copy them.

### iOS and Android.
The Touch Event API doesn't provide us with enough information to know which DOM node we are currently hovering. To get this information, we use the `elementFromPoint` method. To avoid performance drop and spare some of the device battery, we only activate this feature if you listen to at least one of these events:  `pointerenter`, `pointerleave`, `pointerover`, `pointerout`. Another system prevents this feature to be called for each `touchmove` event, but only if the pointer was moved by a certain distance or after a certain time. We'll add a hook to modify these values in the future.

### Windows and MacOSX
Only Edge fully supports the Pointer Event API in its public version (and in that case our library only acts as a wrapper to use event delegation). For other browsers, we use the Mouse Event API to generate the pointer events. This should not impact performances.
Firefox and Chrome are currently developing the PointerEvent API (https://www.chromestatus.com/feature/4504699138998272).

## Supported Events:
 - pointerdown
 - pointerup
 - pointermove
 - pointerenter
 - pointerleave
 - pointerover
 - pointerout

## Supported browsers:
 - Chrome (Window, Linux, MacOS X and Android)
 - Safari (MacOS X and iOS)
 - Firefox (Window, Linux, MacOS X)
 - Edge
 - IE11


## Quirks

### CSS touch-action
The CSS `touch-action` property is not supported by this system.

## Example
### React JS with ES6 example
```javascript
import { addListener, removeListener } from 'spur-events';

class PointerTest extend React.Component {
    constructor(props) {
        super(props);
        this.property = 'myProperty';
    }

    onPointerEnter (e) {
        console.log(this.property, e.target, e.clientX, e.clientY); // 'this' is the PointerTest class instance.
    }

    componentDidMount () {
        addListener(this.refs.someDOMNode, 'pointerenter', this.onPointerEnter, { context: this });
    }

    componentWillUnmount () {
        removeListener(this.refs.someDOMNode, 'pointerenter', this.onPointerEnter, { context: this });
    }
}
```

### removeListenerById
```javascript
import { addListener, removeListener } from 'spur-events';

class PointerTest extend React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        addListener(this.refs.someDOMNode, 'pointerenter', (e) = {
            // do something
        }, { context: this, id: 'myPointerEnter' });
    }

    componentWillUnmount () {
        removeListenerById(this.refs.someDOMNode, 'pointerenter', 'myPointerEnter');
    }
}
```

### Custom Event creation and dispatch.
```javascript
import { addListener, removeListener, SpurEvent, dispatchEvent } from 'spur-events';

class PointerTest extend React.Component {
    componentDidMount () {
        addListener(window, 'tap', function (e) {
            // e.target => this.refs.someDOMNode
            // e.currentTarget => window
            // ...
        }, { context: this });

        let event = new SpurEvent('tap');
        event.target = this.refs.someDOMNode;
        dispatchEvent(event);
    }
}
```

### PointerEvent creation and dispatch.
```javascript
import { addListener, removeListener, PointerEvent, dispatchEvent } from 'spur-events';

class PointerTest extend React.Component {
    componentDidMount () {
        addListener(window, 'pointerup', function (e) {
            // ...
        }, { context: this });

        let event = new PointerEvent('pointerup');
        event.target = this.refs.someDOMNode;
        dispatchEvent(event);
    }
}
```

Note that a PointerEvent with  a `pointerenter` or `pointerleave` type will not bubble.


