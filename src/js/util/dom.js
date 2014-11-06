'use strict';

function toggleClass(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = -1;
    for (var i = classes.length; i--;) {
      if (classes[i] === className) {
        existingIndex = i;
      }
    }
    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1);
    } else {
      classes.push(className);
    }
    el.className = classes.join(' ');
  }
}

function addClassHelper(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

function addClass(el, className) {
  if ((Object.prototype.toString.call(el) === '[object NodeList]')) {
    for(var i = 0; i < el.length; i++) {
      addClassHelper(el[i], className);
    }
  } else {
      addClassHelper(el, className);
  }
}

function removeClassHelper(el, className){
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }  
}

function removeClass(el, className) {
  if ((Object.prototype.toString.call(el) === '[object NodeList]')) {
    for(var i = 0; i < el.length; i++) {
      removeClassHelper(el[i], className);
    }
  } else {
      removeClassHelper(el, className);
  }
}

module.exports = {
  toggleClass: toggleClass,
  addClass: addClass,
  removeClass: removeClass
};
