# Spur Events
Cross-browser &amp; cross-platform event system based on the PointerEvent API defined by the w3c specifications (http://www.w3.org/TR/pointerevents/). This library supports every major browsers (Chrome, Safari, Edge, Firefox) on every major platforms (Windows, MacOSX, Linux, Android, iOS).

## Usage
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

## Event object
For an accurate properties description, please read the specifications of the w3c for Pointer Events.
```javascript
Event: {
    pointerId,
    pointerType, // 'mouse', 'touch' or 'pen'
    width, // we use the 'radiusX' value for touch events. 0 for mouse events
    height, // we use the 'radiusY' value for touch events. 0 for mouse events
    pressure, // we use the 'force' value for touch events. 1 for mouse events
    tiltX, // 0 if the browser doesn't support Pointer Event natively
    tiltY, // 0 if the browser doesn't support Pointer Event natively
    isPrimary,

    clientX,
    clientY,
    screenX,
    screenY,
    type, // 'pointerdown', 'pointerup', 'pointermove' ...
    target;  // DOM node target

    originalEvent // original event that was used to generate this object
}
```

The Event object also provides the `stopPropagation` and `preventDefault` methods.
```javascript
function onPointerEnter(e) {
    e.stopPropagation();
    e.preventDefault();
}
```

Note that the `stopPropagation` method only stops the propagation of the events throughout our system. The native browser events are not impacted. In order to do so, you can call the `stopPropagation` method of the event `originalEvent` property.

## Advanced Usage
In order to use prototype methods as listener, like with React JS, you can provide the listener with a specific context.
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
 - IE9+


## Quirks
To avoid the simulation of mouse events on Touch devices, we call the `preventDefault` method on the `touchstart` event. This prevent you from using `click` events. We are currently looking for another way to avoid the event simulation. We might instead simulate the `click` with our system.

## Future
We plan on supporting listening on the capture phase. At the moment, only listening on the bubbling phase is possible.
