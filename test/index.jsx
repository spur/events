var React = require('react');
var ReactDOM = require('react-dom');
var SpurEvents = require('../index.js');
var addListener = SpurEvents.addListener;
var removeListener = SpurEvents.removeListener;
var removeListenerById = SpurEvents.removeListenerById;
var removeAllListeners = SpurEvents.removeAllListeners;
var PointerEvent = SpurEvents.PointerEvent;
var SpurEvent = SpurEvents.SpurEvent;
var dispatchEvent = SpurEvents.dispatchEvent;

require('./styles.less');

var PointerTest = React.createClass({
  onPointerEnter: function (e) {
    e.target.classList.add('hover');
    console.log('enter', e.target.className)
  },
  onPointerLeave: function (e) {
    e.target.classList.remove('hover');
    console.log('leave', e.target.className)
  },
  onPointerDown: function (e) {
    console.log('pointer down', e.target.className);
  },
  onPointerUp: function (e) {
    console.log('pointer up', e.target.className);
  },
  onPointerOut: function (e) {
    console.log('pointer out', e.target.className);
  },
  onPointerOver: function (e) {
    console.log('pointer over', e.target.className);
  },
  onPointer: function (e) {
    console.log(e.type, e.target.className);
  },
  componentDidMount: function () {

    // var start;
    // function checkPropagationtime() {
    //   console.log('propagation time', (performance.now() - start))
    // }

    // addListener(this.refs.lastLevel, 'pointerdown', function () {
    //   start = performance.now();
    //   console.log('hit last level')
    // }, { context: this, capture: true });

    addListener(window, 'pointermove', function (e) {
      e.preventDefault();
      console.log('pointermove', e.target);
    });
    
    addListener(this.refs.firstLevel, 'pointerout', this.onPointer, { context: this });
    addListener(this.refs.firstLevel, 'pointerover', this.onPointer, { context: this });
    addListener(this.refs.firstLevel, 'pointerup', this.onPointer, { context: this });
    addListener(this.refs.firstLevel, 'pointerdown', this.onPointer, { context: this });

    addListener(this.refs.firstLevel, 'pointerenter', this.onPointerEnter);
    addListener(this.refs.firstLevel, 'pointerleave', this.onPointerLeave);

    addListener(this.refs.secondLevelB, 'pointerenter', this.onPointerEnter);
    addListener(this.refs.secondLevelB, 'pointerleave', this.onPointerLeave);

    addListener(this.refs.secondLevelA, 'pointerenter', this.onPointerEnter, {  id: 'test' });
    addListener(this.refs.secondLevelA, 'pointerleave', this.onPointerLeave);

    // addListener(window, 'pointerdown', this.onPointerDown);
    this.refs.firstLevel.addEventListener('click', function () { console.log('click') });

    addListener(this.refs.firstLevel, 'tap', function (e) {
      console.log('tap!', e);
    });

    var event = new SpurEvent('tap');
    event.target = this.refs.secondLevelB;
    event.bubbles = true;
    dispatchEvent(event);


    // var event = new PointerEvent('pointerdown');
    // // event.target = this.refs.firstLevel;

    // dispatchEvent(event);

    // removeAllListeners(this.refs.secondLevelA, 'pointerenter');

    // this.refs.lastLevel.addEventListener('pointerdown', function () {
    //   start = performance.now();
    //   console.log('hit last level')
    // }, true);

    // this.refs.firstLevel.addEventListener('pointerout', this.onPointer);
    // this.refs.firstLevel.addEventListener('pointerover', this.onPointer);
    // this.refs.firstLevel.addEventListener('pointerup', this.onPointer);
    // this.refs.firstLevel.addEventListener('pointerdown', checkPropagationtime);

    // this.refs.firstLevel.addEventListener('pointerenter', this.onPointerEnter);
    // this.refs.firstLevel.addEventListener('pointerleave', this.onPointerLeave);

    // this.refs.secondLevelB.addEventListener('pointerenter', this.onPointerEnter);
    // this.refs.secondLevelB.addEventListener('pointerleave', this.onPointerLeave);

    // this.refs.secondLevelA.addEventListener('pointerenter', this.onPointerEnter);
    // this.refs.secondLevelA.addEventListener('pointerleave', this.onPointerLeave);

    // this.refs.secondLevelB.addEventListener('mouseout', function () { console.log('out') }, false);
    // this.refs.secondLevelB.addEventListener('mouseup', function () { console.log('up') }, false);
    // this.refs.secondLevelB.addEventListener('mousedown', function () { console.log('down') }, false);
    // this.refs.secondLevelB.addEventListener('mouseenter', function () { console.log('enter') }, false);
    // this.refs.secondLevelB.addEventListener('mouseleave', function () { console.log('leave') }, false);
  },
  componentWillUnmount: function () {
    // this.DOMNode.removeListener(listenerType, this.onPointerDown);
    // removeListener(this.DOMNode, listenerType, this.onMouseDown);
    // removeListener(this.refs.firstLevel, listenerType, this.onMouseDown);
    // removeListener(this.refs.secondLevelA, 'pointerdown', this.onMouseDown);
    // removeListener(this.refs.secondLevelB, 'pointerenter', this.onPointerEnter);
    // removeListener(this.refs.secondLevelB, 'pointerleave', this.onPointerLeave);
  },
  createChild: function (count) {
    if (count === 0) {
      return (<div ref='lastLevel'>test</div>);
    }
    return (<div>{this.createChild(count - 1)}</div>)
  },
  render: function () {
    return (
      <div className='pointer-test'>
        <div className='first-level' ref='firstLevel'>
          <div className='second-level a' ref='secondLevelA'>
          {
            this.createChild(10)
          }
          </div>
          <div className='second-level b' ref='secondLevelB'>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ReactDOM.render(<PointerTest />, document.getElementById('pointer-test'));
