'use strict';

function xhr(method, url, data, callback) {
  var request = new XMLHttpRequest();
  request.open(method, url, true);

  // Some people say this trigger CORS.
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  if (method === 'POST') {
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  }
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        callback(null, this.responseText);
      } else {
        callback(this.statusText);
      }
    }
  };
  if (data) {
    request.send(uriSerializer(data));
  } else {
    request.send();
  }
  request = null;
}

function get(url, callback) {
  xhr('GET', url, null, callback);
}

function post(url, data, callback) {
  xhr('POST', url, data, callback);
}

function getJSONP(url, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }
  opts || (opts = {});
  opts.callbackParam || (opts.callbackParam = 'callback');
  var scr = document.createElement('script');
  var cb = 'jsonp_' + (new Date()).getTime();
  scr.src = url + (url.match(/\?/) ? '&' : '?') + opts.callbackParam + '=' + cb;
  scr.async = true;
  scr.onload = function () {
    setTimeout(function () {
      delete window[cb];
    }, 0);
  };
  window[cb] = callback;
  document.querySelector('head').appendChild(scr);
}

function supportsCORS() {
  return 'withCredentials' in new XMLHttpRequest();
}

function uriSerializer(obj) {
  var str = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      str.push(encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]));
    }
  }
  return str.join('&');
}

module.exports = {
  xhr: xhr,
  get: get,
  post: post,
  getJSONP: getJSONP,
  supportsCORS: supportsCORS,
  uriSerializer: uriSerializer
};
