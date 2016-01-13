var POINTER_TYPE_MOUSE = 'mouse';
var POINTER_TYPE_PEN = 'pen';
var POINTER_TYPE_TOUCH = 'touch';

var POINTER_DOWN = 'pointerdown';
var POINTER_MOVE = 'pointermove';
var POINTER_UP = 'pointerup';
var POINTER_CANCEL = 'pointercancel';
var POINTER_ENTER = 'pointerenter';
var POINTER_OVER = 'pointerover';
var POINTER_LEAVE = 'pointerleave';
var POINTER_OUT = 'pointerout';

var MOUSE_IDENTIFIER = '0';

var pointerTypes = {
  mouse: 'mouse',
  pen: 'pen',
  touch: 'touch'
};

var pointerEventTypes = {
  down: POINTER_DOWN,
  move: POINTER_MOVE,
  up: POINTER_UP,
  cancel: POINTER_CANCEL,
  enter: POINTER_ENTER,
  over: POINTER_OVER,
  leave: POINTER_LEAVE,
  out: POINTER_OUT
};

module.exports = {
  mouseIdentifier: MOUSE_IDENTIFIER,
  pointerTypes: pointerTypes,
  pointerEventTypes: pointerEventTypes
};
