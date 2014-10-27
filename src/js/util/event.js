'use strict';

// Binds a single event.
function addEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, handler);
  }
}

// Binds events to an array of elements elements.
function on(els, eventName, handler) {
  for (var i = 0; i < els.length; i++) {
    addEventListener(els[i], eventName, handler);
  }
}

module.exports = {
  addEventListener: addEventListener,
  on: on
};
