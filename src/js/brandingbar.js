'use strict';

require('es5-shim');

var event = require('./util/event'),
    dom = require('./util/dom'),
    ajax = require('./util/ajax'),
    panelTemplate = require('./template/panel'),
    barTemplate = require('./template/bar'),
    donationTemplate = require('./template/barDonate'),
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

var stripeResponseHandler = function(status, response) {
  var $form = document.querySelector('#bb-transaction-form');
  if (response.error) {
    window.console && console.log(response.error.message);
  } else {
    var token = response.id;
    var $input = document.createElement('input');
    $input.type = 'hidden';
    $input.name = 'stripe_token';
    $input.value = token;
    $form.appendChild($input);

    var data = {
      email: 'jcarbaugh@gmail.com',
      first_name: 'Jeremy',
      last_name: 'Carbaugh',
      stripe_token: $form.querySelector('[name=stripe_token]').value
    };

    var data = dom.serializeForm($form);
    if (!data.amount) {
      data.amount = data.amount_other;
    }
    delete data.amount_other;

    window.console && console.log(data);

    var url = 'https://sunlightfoundation.com/engage/donate/remote/';
    ajax.post(url, data, function(err, resp) {

      var step2 = document.querySelectorAll('.bb-modal-form-step-2');
      var step3 = document.querySelectorAll('.bb-modal-form-step-3');

      toggle(step2, {toggle: 'is-active'});
      toggle(step3, {toggle: 'is-active'});

    });

  }
};

function loadBrandingBar() {
  var bar = document.querySelector('[data-' + namespace() + '-brandingbar]');
  if (bar) {
    var panel = document.querySelector('#' + namespace() + '_panel');
    var url = 'https://sunlightfoundation.com/brandingbar/';
    // var propertyId = bar.getAttribute('data-' + namespace() + '-property-id');
    var loadingStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar.min.css.gz', ['brandingbar.css', 'brandingbar.min.css', 'brandingbar.min.css.gz']);
    var loadingDefaultStylesheet = false;
    // // comment this line in to load the twitter widgets platform
    // var loadingTwitter = ajax.conditionalGet('script', 'https://platform.twitter.com/widgets.js', 'platform.twitter.com/widgets.js');

    // Set up bar
    if(!bar.innerHTML) {
      bar.innerHTML = render(barTemplate);
      loadingDefaultStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar-default.min.css.gz', ['brandingbar-default.css', 'brandingbar-default.min.css', 'brandingbar-default.min.css.gz']);
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

function loadDonationBar(stripeKey) {
  var bar = document.querySelector('[data-' + namespace() + '-brandingbar]');
  var body = document.querySelector('body');
  if (bar) {
    // var panel = document.querySelector('#' + namespace() + '_panel');

    window.console && console.log('propertyId: ' + propertyId);

    var stripeTag = document.createElement('script');
    document.querySelector('head').appendChild(stripeTag);
    stripeTag.onload = function(e) {
      Stripe.setPublishableKey(stripeKey);
    };
    stripeTag.src = 'https://js.stripe.com/v2/';

    var loadingStylesheet = ajax.conditionalGet('link', '//localhost:4000/dist/css/donatebar.min.css', ['donatebar.css', 'donatebar.min.css', 'donatebar.min.css.gz']);
    var loadingDefaultStylesheet = false;
    // // comment this line in to load the twitter widgets platform
    // var loadingTwitter = ajax.conditionalGet('script', 'https://platform.twitter.com/widgets.js', 'platform.twitter.com/widgets.js');

    // Set up bar
    if(!bar.innerHTML) {
      bar.innerHTML = render(donationTemplate);
    }

    // Set up modal

    modal = document.createElement('div');
    bar.parentElement.insertBefore(modal, bar);

    modal.innerHTML = render(modalTemplate);


    var donateButton = document.querySelectorAll('.js-modal-open');
    var modalClose = document.querySelectorAll('.js-modal-close');
    var overlay = document.querySelector('.bb-overlay');
    var modal = document.querySelector('.bb-modal_donation');
    var modalPrompt = document.querySelector('.bb-modal_initial-prompt');

    var step1 = document.querySelectorAll('.bb-modal-form-step-1');
    var step2 = document.querySelectorAll('.bb-modal-form-step-2');
    var step3 = document.querySelectorAll('.bb-modal-form-step-3');

    var nextFrame1 = document.querySelectorAll('.bb-modal-form-step-1 .js-next-frame');
    var nextFrame2 = document.querySelectorAll('.bb-modal-form-step-2 .js-next-frame');

    var prevFrame2 = document.querySelectorAll('.bb-modal-form-step-2 .js-prev-frame');

    function resetDonationForm() {
      // clear form
      var formInput = document.querySelectorAll('.bb-input');

      for (var i = 0; i < formInput.length; i++) {
        formInput[i].value = '';
      }

      // reset form steps after modal is hidden
      setTimeout(function() {
        dom.removeClass(step1, 'is-active');
        dom.removeClass(step2, 'is-active');
        dom.removeClass(step3, 'is-active');
      }, 300);
    }

    // open donate modal
    event.on(donateButton, 'click', function(e){
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      dom.addClass(overlay, 'is-active');
      dom.addClass(modal, 'is-active');
      dom.addClass(step1, 'is-active');
    });

    // close donate modal
    event.on(modalClose, 'click', function(e){
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      dom.removeClass(overlay, 'is-active');
      dom.removeClass(modal, 'is-active');
      dom.removeClass(modalPrompt, 'is-active');

      resetDonationForm();
    });

    // proceed to next step
    event.on(nextFrame1, 'click', function(e) {
      toggle(step1, {toggle: 'is-active'});
      toggle(step2, {toggle: 'is-active'});
    });

    event.on(nextFrame2, 'click', function(e) {
      var $form = document.querySelector('#bb-transaction-form');
      var propertyId = bar.getAttribute('data-' + namespace() + '-property-id');
      if (propertyId) {
        var $elem = document.createElement('input');
        $elem.type = 'hidden';
        $elem.name = 'source';
        $elem.value = propertyId;
        $form.appendChild($elem);
      }
      Stripe.card.createToken($form, stripeResponseHandler);
    });

    event.on(prevFrame2, 'click', function(e) {
      toggle(step2, {toggle: 'is-active'});
      toggle(step1, {toggle: 'is-active'});
    });

    var triggerAdditionalFields = document.querySelectorAll('.js-trigger-note');
    var additionalFields = document.querySelector('.bb-form-additional-fields');

    event.on(triggerAdditionalFields, 'change', function() {
        toggle(additionalFields, {toggle: 'is-active'});
    });

  }
}

function loadBar() {
  var url = 'https://sunlightfoundation.com/engage/brandingbar/config/?src=IE';
  ajax.get(url, function(err, content) {
    if (content && content !== '') {
      var data = JSON.parse(content);
      if (data.type === 'donation') {
        loadDonationBar(data.stripe.key);
      } else {
        loadBrandingBar();
      }
    } else {
      loadBrandingBar();
    }
  });
}

loadBar();
