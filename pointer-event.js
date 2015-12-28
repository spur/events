function PointerEvent() {
  this.pointerId = null;
  this.pointerType = null;
  this.x = null;
  this.y = null;
  this.type = null;
  this.target = null;
  this.originalEvent = null;

  // internal
  this.propagationStopped = false;
}

PointerEvent.prototype.preventDefault = function () {
  this.originalEvent.preventDefault();
};

PointerEvent.prototype.stopPropagation = function () {
  this.propagationStopped = true;
};

module.exports = PointerEvent;
