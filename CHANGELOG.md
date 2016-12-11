# CHANGELOG


## SPUR EVENTS 0.1.7 - 2016-12-11

### FIXES
- typings: PointerEvent becomes SpurPointerEvents to avoid collision with the native class.


## SPUR EVENTS 0.1.6 - 2016-11-15

### IMPROVEMENTS
- Typescript definitions: addListener and removeListener accept a generic parameter


## SPUR EVENTS 0.1.5 - 2016-11-11

### FIXES
- Correctly exposes the setupBaseNode method


## SPUR EVENTS 0.1.4 - 2016-11-10

### IMPROVEMENTS
- Added Typescript typings.


## SPUR EVENTS 0.1.3 - 2016-08-08

### FIXES
- bug in chrome implantation of the PointerEvent API: pointer type is not defined.
- mouse emulated events are now correctly ignored.

### FEATURE
- selection of the base node allows the API to be used inside shadow DOM components.


## SPUR EVENTS 0.1.2 - 2016-02-25

### FIXES
- buttons and button properties were wrong with touchend related events.
- buttons property not supported by Safari.


## SPUR EVENTS 0.1.1 - 2016-01-27

### FEATURES
- Support for the button and buttons properties on the event object.
- Added a changelog.

### CLEAN UP
- Remove the current/downPointers system


## SPUR EVENTS 0.1.0 - 2016-01-23

- Initial release
