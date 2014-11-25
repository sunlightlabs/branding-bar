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

function serializeForm(form) {
  var data = {};
  var elems = form.elements;
  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];
    if (elem.name) {
      if (elem.type === 'button') {
        // ignore
      } else if (elem.type === 'radio') {
        if (elem.checked) {
          data[elem.name] = elem.value;
        }
      } else {
        data[elem.name] = elem.value;
      }
    }
  }
  return data;
};

function empty(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
};

function show(node) {
  node.style.display = 'block';
};

function hide(node) {
  node.style.display = 'none';
};

module.exports = {
  toggleClass: toggleClass,
  addClass: addClass,
  removeClass: removeClass,
  serializeForm: serializeForm,
  empty: empty,
  show: show,
  hide: hide
};
