

require('es5-shim');

var event = require('./util/event'),
    dom = require('./util/dom'),
    ajax = require('./util/ajax'),
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

function loadBrandingBar() {

  var bar = document.querySelector('[data-' + namespace() + '-brandingbar]');
  if (bar) {
    // var url = 'https://sunlightfoundation.com/brandingbar/';
    // var loadingStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar.min.css.gz', ['brandingbar.css', 'brandingbar.min.css', 'brandingbar.min.css.gz']);
    // var loadingDefaultStylesheet = false;
    // // comment this line in to load the twitter widgets platform
    // var loadingTwitter = ajax.conditionalGet('script', 'https://platform.twitter.com/widgets.js', 'platform.twitter.com/widgets.js');

    // Set up bar
    if(!bar.innerHTML) {
      bar.innerHTML = render(barTemplate);
      // loadingDefaultStylesheet = ajax.conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar-default.min.css.gz', ['brandingbar-default.css', 'brandingbar-default.min.css', 'brandingbar-default.min.css.gz']);
    }
  }
}

var CURRENT_CAMPAIGN = 'holiday-season';

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