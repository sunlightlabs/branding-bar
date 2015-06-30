require('es5-shim');

var event = require('./util/event'),
    dom = require('./util/dom'),
    ajax = require('./util/ajax');

// document ready
function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

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

var formatAmount = function(amount) {
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

var donateButton = document.querySelectorAll('.js-modal-open');
var modalClose = document.querySelectorAll('.js-modal-close');
var overlay = document.querySelector('.bb-overlay');
var modal = document.querySelector('.bb-modal_donation');
var modalPrompt = document.querySelector('.bb-modal_prompt');

var step1 = document.querySelectorAll('.bb-modal-form-step-1');
var step2 = document.querySelectorAll('.bb-modal-form-step-2');
var step3 = document.querySelectorAll('.bb-modal-form-step-3');

var nextFrame1 = document.querySelectorAll('.bb-modal-form-step-1 .js-next-frame');
var nextFrame2 = document.querySelectorAll('.bb-modal-form-step-2 .js-next-frame');

var prevFrame2 = document.querySelectorAll('.bb-modal-form-step-2 .js-prev-frame');

var openForm = document.querySelectorAll('.bb-modal_prompt .js-open-form');

var propertyId;

function loadDonationBar(stripeKey) {

    var stripeTag = document.createElement('script');
    document.querySelector('head').appendChild(stripeTag);
    stripeTag.onload = function(e) {
      Stripe.setPublishableKey(stripeKey);
    };
    stripeTag.src = 'https://js.stripe.com/v2/';

    // Open donate form from prompt
    event.on(openForm, 'click', function(e){
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      dom.removeClass(modalPrompt, 'is-active');
      toggle(modal, {toggle: 'is-active'});
      toggle(step1, {toggle: 'is-active'});
    });

    // close donate modal
    event.on(modalClose, 'click', function(e){
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      dom.removeClass(overlay, 'is-active');
      dom.removeClass(modal, 'is-active');
      dom.removeClass(modalPrompt, 'is-active');
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
      //var propertyId = bar.getAttribute('data-' + namespace() + '-property-id');
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

// open donate modal
function showModal() {
  dom.addClass(overlay, 'is-active');
  dom.addClass(modal, 'is-active');
  dom.addClass(step1, 'is-active');
}

// open donate modal with a prompt
function showModalPrompt() {
  dom.addClass(overlay, 'is-active');
  dom.addClass(modalPrompt, 'is-active');
}

// intialize on document ready
function initialize() {

  window.addEventListener('message', receiveMessage, false);

  var closeBtns = document.getElementsByClassName('js-modal-close');
  for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].onclick = removeIframe;
  }

  function removeIframe() {  
      parent.postMessage('donation:remove', '*');
  }
  window.parent.postMessage('donation:configure', '*');
}

function receiveMessage(event) {
  if (event.data === 'donation:newVisitor') {
    showModalPrompt();
  } else if (event.data === 'donation:open') {
    showModal();
  } else if (/^donation:propertyId:.+/.test(event.data)) {
    propertyId = event.data.replace('donation:propertyId:', '');
  } else if (/^donation:stripeKey:.+/.test(event.data)) {
    loadDonationBar(event.data.replace('donation:stripeKey:', ''));
    parent.postMessage('donation:ready', '*');
  }
}

ready(initialize);
