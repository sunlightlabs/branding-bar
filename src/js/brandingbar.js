

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

var CURRENT_CAMPAIGN = 'state-sunshineWeek2015';

function loadDonationBar() {
  var bar = document.querySelector('[data-' + namespace() + '-brandingbar]');
  var body = document.querySelector('body');
  if (bar) {
    // var panel = document.querySelector('#' + namespace() + '_panel');

    var loadingStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/donatebar.min.css.gz', ['donatebar.css', 'donatebar.min.css', 'donatebar.min.css.gz']);
    var loadingDefaultStylesheet = false;

    // Set up bar
    if(!bar.innerHTML) {
      bar.innerHTML = render(donationTemplate);
    }

    // Set up donation modal

    function newDonation() {
      var iframe = document.createElement("iframe");

      iframe.setAttribute('class', 'bb-donation-modal');
      // iframe.setAttribute('src', 'http://localhost:4000/modal/modal.html');
      // iframe.setAttribute('src', 'https://sunlight-cdn.s3.amazonaws.com/brandingbar/' + s3Version() + '/donation/modal.html');
      iframe.setAttribute('src', 'https://sunlightfoundation.com/engage/brandingbar/modal/');
      iframe.setAttribute("style", "z-index: 9999; display: block; border: 0px none transparent; overflow-x: hidden; overflow-y: auto; visibility: visible; margin: 0px; padding: 0px; -webkit-tap-highlight-color: transparent; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%;");
      iframe.allowtransparency = true;
      iframe.frameBorder = 0;
      document.body.appendChild(iframe);
    }

    var donateButton = document.querySelectorAll('.js-modal-open');
    var modalClose = document.querySelectorAll('.js-modal-close');
    var overlay = document.querySelector('.bb-overlay');
    var modal = document.querySelector('.bb-modal_donation');
    var modalPrompt = document.querySelector('.bb-modal_initial-prompt');

    // open donate modal
    event.on(donateButton, 'click', function(e){
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      newDonation();
    });
  }

  window.addEventListener('message', receiveMessage, false);

  if (isNewToCampaign(CURRENT_CAMPAIGN)) {
    newDonation();
  }
}

/**
 * Checks whether the visitor is new to the specified campaign.
 * If yes, then this also sets the campaign property so that the next time
 * the user visits, this function will return false.
 */
function isNewToCampaign(campaign, markVisited) {
  if (supportsLocalStorage()) {
    var userState = localStorage.getItem('CAMPAIGN_PROPERTY');
    
    if (userState !== campaign) {
      if (markVisited) {
        localStorage.setItem('CAMPAIGN_PROPERTY', campaign);
      }
      
      return true;
    }
  }

  return false;
}

function receiveMessage(event) {
    // if (event.origin !== "http://localhost:4000") {
    // if (event.origin !== 'https://sunlight-cdn.s3.amazonaws.com') {
    if (event.origin !== 'https://sunlightfoundation.com') {
      return false;
    }

    var modal = document.querySelector('.bb-donation-modal');

    if (event.data === 'donation:configure') {
      postPropertyId();
      postStripeKey();
    } else if (event.data === 'donation:ready' && isNewToCampaign(CURRENT_CAMPAIGN, true)) {
      modal.contentWindow.postMessage('donation:newVisitor', '*');
    } else if (event.data === 'donation:ready') {
      modal.contentWindow.postMessage('donation:open', '*');
    } else if (event.data === 'donation:remove') {
      window.setTimeout(function () {
        modal.parentNode.removeChild(modal);
      }, 300);
    }
}

function postPropertyId() {
  var bar = document.querySelector('[data-' + namespace() + '-brandingbar]'),
      propertyId = bar.getAttribute('data-' + namespace() + '-property-id'),
      modal = document.querySelector('.bb-donation-modal');

  modal.contentWindow.postMessage('donation:propertyId:' + propertyId, '*');
}

function postStripeKey() {
  var url = 'https://sunlightfoundation.com/engage/brandingbar/config/',
      modal = document.querySelector('.bb-donation-modal');

  ajax.get(url, function(err, content) {
    if (content && content !== '') {
        var data = JSON.parse(content);
        modal.contentWindow.postMessage('donation:stripeKey:' + data.stripe.key, '*');
      }
  });
}

// test for local storage support
function supportsLocalStorage() {
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

function loadBar() {
  var url = 'https://sunlightfoundation.com/engage/brandingbar/config/';
  ajax.get(url, function(err, content) {
    if (content && content !== '') {
      var data = JSON.parse(content);
      if (data.type === 'donation') {
        loadDonationBar();
      } else {
        loadBrandingBar();
      }
    } else {
      loadBrandingBar();
    }
  });

  // Test on congress.sf only
  // if(location.hostname == "congress.sunlightfoundation.com"){
  //   loadDonationBar();
  // } else {
  //   loadBrandingBar();
  // }
}

loadBar();

// Uncomment to clear local storage for testing
// localStorage.removeItem('CAMPAIGN_PROPERTY');