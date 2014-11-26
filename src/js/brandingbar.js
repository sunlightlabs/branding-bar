

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

var labelize = function(name) {
  if (name === 'cvc') {
    name = 'CVC';
  } else if (name === 'amount_other') {
    name = 'Amount';
  } else {
    var properCase = function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
    name = name.replace('_', ' ')
               .replace('-', '. ')
               .replace(/\w\S*/g, properCase);
  }
  return name;
};

var validateRequired = function($form, fieldNames, attr) {
  attr = attr || 'name';
  var errors = [];
  for (var i = 0; i < fieldNames.length; i++) {
    var fieldName = fieldNames[i];
    var $elem = $form.querySelector('[' + attr + '=' + fieldName + ']');
    if (!$elem.value) {
      errors.push(labelize(fieldName) + ' is a required field');
      dom.addClass($elem, 'bb-input_error');
    } else {
      dom.removeClass($elem, 'bb-input_error');
    }
  }
  return errors;
};

var displayErrors = function($container, errors) {
  var $list = document.createElement('ul');
  dom.addClass($list, 'bb-error_list');
  for (var i = 0; i < errors.length; i++) {
    var $item = document.createElement('li');
    $item.innerHTML = errors[i];
    $list.appendChild($item);
  }
  $container.appendChild($list);
  dom.show($container);
}

var formatAmount = function(amount) {f
  if (amount.value) {
    amount.value = parseFloat(amount.value).toFixed(2);
    return amount.value;
  }
};

var stripeResponseHandler = function(status, response) {

  var $form = document.querySelector('#bb-transaction-form');
  var $errContainer = $form.querySelector('.bb-modal-form-step-2 .bb-error-message');
  dom.empty($errContainer);

  if (response.error) {

    displayErrors($errContainer, [response.error.message]);
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

    dom.hide($errContainer);

    var step2 = document.querySelectorAll('.bb-modal-form-step-2');
    var step3 = document.querySelectorAll('.bb-modal-form-step-3');

    toggle(step2, {toggle: 'is-active'});
    toggle(step3, {toggle: 'is-active'});

    var url = 'https://sunlightfoundation.com/engage/donate/remote/';
    ajax.post(url, data, function(err, resp) {
      var progress = document.querySelector('.bb-modal-message-progress');
      var thanks = document.querySelector('.bb-modal-message-thankyou');
      toggle(progress, {toggle: 'is-hidden'});
      toggle(thanks, {toggle: 'is-active'});
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

    var stripeTag = document.createElement('script');
    document.querySelector('head').appendChild(stripeTag);
    stripeTag.onload = function(e) {
      Stripe.setPublishableKey(stripeKey);
    };
    stripeTag.src = 'https://js.stripe.com/v2/';

    // var loadingStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/donatebar.min.css.gz', ['brandingbar.css', 'brandingbar.min.css', 'brandingbar.min.css.gz']);
    var loadingStylesheet = ajax.conditionalGet('link', '//localhost:4000/dist/css/donatebar.min.css', ['donatebar.css', 'donatebar.min.css', 'donatebar.min.css.gz']);
    var loadingDefaultStylesheet = false;

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
      // clear form input fields
      var formInput = document.querySelectorAll('.bb-input');

      for (var i = 0; i < formInput.length; i++) {
        formInput[i].value = '';
      }

      // clear form input error styling
      var formInputErrors = document.querySelectorAll('.bb-input_error');
      dom.removeClass(formInputErrors, 'bb-input_error');

      // clear form error message
      var formErrorMessage = document.querySelector('.bb-error-message');
      dom.hide(formErrorMessage);

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

      resetDonationForm();
    });

    // custom donation amount setup
    var customAmountField = document.querySelectorAll('.bb-input_other-amount');
    var customAmountRadio = document.querySelector('.bb-input[data-radio-custom]');

    // select correct radio button when custom amount is clicked
    event.on(customAmountField, 'click', function(e){
      customAmountRadio.checked = true;
    });

    // format value in custom amount field
    event.on(customAmountField, 'change', function(e) {
      var amount = document.querySelector('input[name=amount_other]');
      formatAmount(amount);

    // set radio value to formatted value
      customAmountRadio.value = formatAmount(amount);
    });


    // proceed to next steps

    // step 1
    event.on(nextFrame1, 'click', function(e) {

      // grab donation amount from checked radio
      var donationRadios = document.getElementsByName('amount');

      for (var i = 0; i < donationRadios.length; i++) {
          if (donationRadios[i].checked) {
              var donationValue = donationRadios[i].value;

              // update donation amount in messages
              var donationUpdate = document.querySelectorAll('.js-val-donation');
              for (var i = 0; i < donationUpdate.length; i++) {
                donationUpdate[i].innerHTML = '$' + donationValue;
              }
              break;
          }
      }

      var errors = [];
      var $form = document.querySelector('#bb-transaction-form');
      var $amountOther = document.querySelector('.bb-input_other-amount');
      var fieldNames = ['first_name', 'last_name', 'address', 'city', 'state', 'zipcode'];

      dom.removeClass($amountOther, 'bb-input_error');
      if ($form.elements['amount'].value === 'custom') {
        fieldNames.push('amount_other')
      }

      errors = errors.concat(validateRequired($form, fieldNames));

      var $errContainer = $form.querySelector('.bb-modal-form-step-1 .bb-error-message');
      dom.empty($errContainer);
      if (errors.length > 0) {
        displayErrors($errContainer, errors);
      } else {
        dom.hide($errContainer);
        toggle(step1, {toggle: 'is-active'});
        toggle(step2, {toggle: 'is-active'});
      }

    });

    // step 2
    event.on(nextFrame2, 'click', function(e) {
      // grab email address to populate message
      var emailAddress = document.querySelector('.bb-input[data-input-email]').value;
      document.querySelector('.js-val-email').innerHTML = emailAddress.toString();

      var $form = document.querySelector('#bb-transaction-form');
      var propertyId = bar.getAttribute('data-' + namespace() + '-property-id');
      if (propertyId) {
        var $elem = document.createElement('input');
        $elem.type = 'hidden';
        $elem.name = 'source';
        $elem.value = propertyId;
        $form.appendChild($elem);
      }

      var errors = [];
      errors = errors.concat(validateRequired($form, ['email']));
      errors = errors.concat(validateRequired($form, ['number', 'exp-month', 'exp-year', 'cvc'], 'data-stripe'));

      var $errContainer = $form.querySelector('.bb-modal-form-step-2 .bb-error-message');
      dom.empty($errContainer);
      if (errors.length > 0) {
        displayErrors($errContainer, errors);
      } else {
        dom.hide($errContainer);
        Stripe.card.createToken($form, stripeResponseHandler);
      }

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
