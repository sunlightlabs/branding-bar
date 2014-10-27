'use strict';

require('es5-shim');

var event = require('./util/event'),
    dom = require('./util/dom'),
    ajax = require('./util/ajax'),
    // panelTemplate = require('./template/panel'),
    // barTemplate = require('./template/bar'),
    // toolsTemplate = require('./template/tools');
    barTemplate = require('./template/barDonate'),
    modalTemplate = require('./template/modalDonate');

/*
 * Return the namespace that all html, css and js should use
 * This is a function so as to be a little less mutable
 */
function namespace() {
  return 'bb';
}

function version() {
  return '{{ version }}';
}

function s3Version() {
  return parseFloat(version()).toString();
}

function render(tmpl, ctx) {
  ctx || (ctx = {});
  ctx.namespace = namespace();
  ctx.version = version();
  ctx.s3Version = s3Version();
  return tmpl.replace(/\{\{ ?([\w\d_]+) ?\}\}/gi, function(tag, match) {
    return ctx[match] || '';
  });
}

function join(url, email, zipcode) {
  var data = {
    response: 'json',
    email: email,
    zipcode: zipcode
  };
  ajax.post('https://sunlightfoundation.com/join/', data, function(err, resp) {
    if (err) {
      // resp is a string of err message
      var emailFormError = document.querySelector('.' + namespace() + '_email-form-fail');
      toggle(emailFormError, {
        add: 'is-true'
      });
    } else {
      var respData = JSON.parse(resp);
      var url = 'https://sunlightfoundation.com' + respData.redirect;

      var emailForm = document.querySelector('.' + namespace() + '_email-form');
      toggle(emailForm, {
        add: 'is-hidden'
      });

      var emailFormError = document.querySelector('.' + namespace() + '_email-form-fail');
      toggle(emailFormError, {
        remove: 'is-true'
      });

      var emailFormSuccess = document.querySelector('.' + namespace() + '_email-form-success');
      toggle(emailFormSuccess, {
        add: 'is-true'
      });

      var emailSucceessUrl = document.querySelector('.bb_email-sucess-url');
      emailSucceessUrl.href = url;
    }
  });
}

var toggle = function (els, opts) {
  if (typeof opts.toggle === 'string'){ opts.toggle = [opts.toggle]; }
  if (typeof opts.add === 'string'){ opts.add = [opts.add]; }
  if (typeof opts.remove === 'string'){ opts.remove = [opts.remove]; }
  if (typeof els.length === 'undefined') { els = [els]; }
  var i, j;
  for(i=0; i<els.length; i++){
    if (opts.toggle) {
      for (j=0; j<opts.toggle.length; j++){
        dom.toggleClass(els[i], opts.toggle[j]);
      }
    }
    opts.add && dom.addClass(els[i], opts.add.join(' '));
    if (opts.remove) {
      for (j=0; j<opts.remove.length; j++){
        dom.removeClass(els[i], opts.remove[j]);
      }
    }
  }
};

function initialize() {
  var bar = document.querySelector('[data-' + namespace() + '-brandingbar]');
  if (bar) {
    var panel = document.querySelector('#' + namespace() + '_panel');
    var url = 'https://sunlightfoundation.com/brandingbar/';
    var propertyId = bar.getAttribute('data-' + namespace() + '-property-id');
    var loadingStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar.min.css.gz', ['brandingbar.css', 'brandingbar.min.css', 'brandingbar.min.css.gz']);
    var loadingDefaultStylesheet = false;
    // // comment this line in to load the twitter widgets platform
    // var loadingTwitter = ajax.conditionalGet('script', 'https://platform.twitter.com/widgets.js', 'platform.twitter.com/widgets.js');

    // Set up bar
    if(!bar.innerHTML) {
      bar.innerHTML = render(barTemplate);
      // loadingDefaultStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar-default.min.css.gz', ['brandingbar-default.css', 'brandingbar-default.min.css', 'brandingbar-default.min.css.gz']);
    }
    // Set up panel
    if (!panel) {
      panel = document.createElement('div');
      if (loadingStylesheet) {
        panel.style.display = "none";
        setTimeout(function(){
          panel.style.display = "";
        }, 750);
      }
      panel.id = namespace() + '_panel';
      bar.parentElement.insertBefore(panel, bar);
    }
    if (!panel.innerHTML) {
      panel.innerHTML = render(panelTemplate);
    }

    var brandingPane = document.querySelector('.' + namespace() + '_wrapper');
    var brandingBarTriggers = document.querySelectorAll('[data-' + namespace() + '-toggle="' + '.' + namespace() + '_wrapper"]');
    var panelTriggers = panel.querySelectorAll('.' + namespace() + '_tools-heading');
    var panels = panel.querySelectorAll('.' + namespace() + '_tools-details');

    // Bind events to show/hide the top panel
    event.on(brandingBarTriggers, 'click', function(ev){
      ev.preventDefault();
      toggle(brandingPane, {toggle: 'is-active'});
    });

    // Bind events to show/hide the tools panels
    event.on(panelTriggers, 'click', function(ev){
      var panelToShow = document.querySelector(this.getAttribute('data-' + namespace() + '-toggle'));
      ev.preventDefault();
      if (typeof panelToShow === 'undefined') { return; }

      toggle(panelTriggers, {
        toggle: 'is-inactive'
      });
      toggle(panels, {
        add: 'is-hidden',
        remove: namespace() + '_fade-animation'
      });
      toggle(panelToShow, {
        add: namespace() + '_fade-animation',
        remove: 'is-hidden'
      });
    });


    // Update featured tools based on current site
    if (propertyId) {
      url += '?pid=' + propertyId;
      ajax.getJSONP(url, function(data) {
        var list = featuredTools.querySelector('ul');
        list.innerHTML = '';
        for (var i=0; i<data.length; i++) {
          list.innerHTML += render(toolTemplate, data[i]);
        }
      });
    }

    // Ajax the signup form if cors support was detected
    if (ajax.supportsCORS()) {
      var form = document.querySelector('.' + namespace() + '_email-form');
      event.addEventListener(form, 'submit', function(ev) {
        ev.preventDefault();
        var email = form.querySelector('input[name=email]').value;
        var zipcode = form.querySelector('input[name=zipcode]').value;
        window.console && console.log(email + " " + zipcode);
        join('https://sunlightfoundation.com/subscribe/', email, zipcode);
      });
    }
  }
}

var featuredTools;

// This kicks off the panel render
initialize();
