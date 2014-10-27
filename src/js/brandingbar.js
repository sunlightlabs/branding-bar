'use strict';

require('es5-shim');

var event = require('./util/event'),
    dom = require('./util/dom'),
    ajax = require('./util/ajax');

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

// Loads a link or script unless one ending with condition is found on the page.
function conditionalGet(tagName, url, condition) {
  var already = false;
  if (typeof condition === 'object' && Object.prototype.toString.call(condition) === '[object Array]') {
    if (tagName == 'script'){
      selectors = condition.map(function(item){
        return tagName + '[src$="' + item + '"]';
      });
    } else {
      selectors = condition.map(function(item){
        return tagName + '[href$="' + item + '"]';
      });
    }
    condition = selectors.join(', ');
    already = document.querySelectorAll(condition).length;
  } else if (typeof condition === 'string'){
    already = document.querySelectorAll(tagName + (tagName == 'script') ? '[src$="' + condition + '"]' : '[href$="' + condition + '"]').length;
  }
  if(already) { return false; }
  var tag = document.createElement(tagName);
  if (tagName == 'script') {
    tag.src = url;
  } else {
    tag.href = url;
    tag.rel = 'stylesheet';
  }
  document.querySelector('head').appendChild(tag);
  return true;
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
    var loadingStylesheet = conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar.min.css.gz', ['brandingbar.css', 'brandingbar.min.css', 'brandingbar.min.css.gz']);
    var loadingDefaultStylesheet = false;
    // // comment this line in to load the twitter widgets platform
    // var loadingTwitter = conditionalGet('script', 'https://platform.twitter.com/widgets.js', 'platform.twitter.com/widgets.js');

    // Set up bar
    if(!bar.innerHTML) {
      bar.innerHTML = render(barTemplate);
      loadingDefaultStylesheet = conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + s3Version() + '/css/brandingbar-default.min.css.gz', ['brandingbar-default.css', 'brandingbar-default.min.css', 'brandingbar-default.min.css.gz']);
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

// this is the main panel template
var panelTemplate = '' +
'  <button id="{{ namespace }}_close-panel" type="button" data-{{ namespace }}-toggle=".{{ namespace }}_wrapper">&times;</button>' +
'  <div class="{{ namespace }}_panel-container">' +
'    <div class="{{ namespace }}_about">' +
'      <span class="{{ namespace }}_heading">About Sunlight Foundation</span>' +
'      <p class="{{ namespace }}_description">The <a class="{{ namespace }}_link" href="https://sunlightfoundation.com">Sunlight Foundation</a> is a nonpartisan nonprofit that advocates for open government globally and uses technology to make government more accountable to all.</p>' +
'' +
'      <div class="{{ namespace }}_email">' +
'        <span class="{{ namespace }}_heading">Stay informed about our work</span>' +
'        <form class="{{ namespace }}_email-form" action="https://sunlightfoundation.com/join/" method="post">' +
'          <input class="{{ namespace }}_input" type="email" placeholder="email address" name="email">' +
'          <input class="{{ namespace }}_input {{ namespace }}_input-zip" type="text" placeholder="zip code" name="zipcode">' +
'          <button class="{{ namespace }}_submit" type="submit">Submit</button>' +
'          <span class="{{ namespace }}_email-form-fail">Oops, there was an error :(</span>' +
'        </form>' +
'        <div class="bb_email-form-success"> Thanks for subscribing to our updates! <a class="bb_link bb_email-sucess-url" href="">Tell us more about you &raquo;</a></div>' +
'      </div>' +
'    </div>' +
'' +
'    <div class="{{ namespace }}_tools">' +
'      <span class="{{ namespace }}_heading">' +
'        <span class="{{ namespace }}_tools-heading" id="{{ namespace }}_featured-tools-heading" data-{{ namespace }}-toggle="#{{ namespace }}_featured-tools">Related Tools</span>' +
'        <span class="{{ namespace }}_tools-heading is-inactive" id="{{ namespace }}_more-tools-heading" data-{{ namespace }}-toggle="#{{ namespace }}_more-tools">All Tools</span>' +
'      </span>' +
'' +
'      <div id="{{ namespace }}_featured-tools" class="{{ namespace }}_tools-details">' +
'        <ul class="{{ namespace }}_tools-featured">' +
'          <li>' +
'            <a class="{{ namespace }}_tools-logo" href="https://www.opencongress.org">' +
'            <img src="https://sunlight-cdn.s3.amazonaws.com/brandingbar/{{ s3Version }}/img/logo_opencongress.png" alt="Open Congress"/>' +
'            </a>' +
'            <p class="{{ namespace }}_description">' +
'              <a class="{{ namespace }}_link" href="https://www.opencongress.org">OpenCongress</a> allows anyone to follow legislation in Congress, from bill introduction to floor votes. Learn more about the issues you care about.' +
'            </p>' +
'          </li>' +
'          <li>' +
'            <a class="{{ namespace }}_tools-logo" href="https://scout.sunlightfoundation.com">' +
'              <img src="https://sunlight-cdn.s3.amazonaws.com/brandingbar/{{ s3Version }}/img/logo_scout.png" alt="Scout"/>' +
'            </a>' +
'            <p class="{{ namespace }}_description">' +
'              <a class="{{ namespace }}_link" href="https://scout.sunlightfoundation.com">Scout</a> is a rapid notification service that allows anyone to create customized email or text alerts on actions Congress takes on an issue or a specific bill.' +
'            </p>' +
'          </li>' +
'        </ul>' +
'      </div>' +
'      <div id="{{ namespace }}_more-tools" class="{{ namespace }}_tools-details is-hidden">' +
'        <ul class="{{ namespace }}_tools-list">' +
'          <li><a class="{{ namespace }}_link" href="https://www.opencongress.org">OpenCongress</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://influenceexplorer.com">Influence Explorer</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://openstates.org">Open States</a></li>' +
'          <li><a class="{{ namespace }}_link" href="https://scout.sunlightfoundation.com">Scout</a></li>' +
'        </ul>' +
'' +
'        <ul class="{{ namespace }}_tools-list">' +
'          <li><a class="{{ namespace }}_link" href="http://churnalism.sunlightfoundation.com">Churnalism</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://capitolwords.org">Capitol Words</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://politwoops.sunlightfoundation.com">Politwoops</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://adhawk.sunlightfoundation.com">Ad Hawk</a></li>' +
'        </ul>' +
'' +
'        <ul class="{{ namespace }}_tools-list">' +
'          <li><a class="{{ namespace }}_link" href="http://politicalpartytime.org">Party Time</a></li>' +
'          <li><a class="{{ namespace }}_link" href="https://scout.sunlightfoundation.com">Scout</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://docketwrench.sunlightfoundation.com">Docket Wrench</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://politicaladsleuth.com">Political Ad Sleuth</a></li>' +
'        </ul>' +
'      </div>' +
'    </div>' +
'  </div>' +
'';

// This is the template for an individual related tool
var toolTemplate = '' +
'  <li>' +
'    <a class="{{ namespace }}_tools_logo" href="{{ href }}">' +
'      <img src="{{ img }}" alt="{{ name }}"/>' +
'    </a>' +
'    <p class="{{ namespace }}_description">' +
'      {{ description }}' +
'    </p>' +
'  </li>' +
'';

// This is the template for the bar itself if it's empty
var barTemplate = '' +
'  <div class="branding-bar_container">' +
'    <div class="branding-bar_links">' +
'      <a class="social" href="https://www.facebook.com/sunlightfoundation"><span class="sficon-facebook"></span></a>' +
'      <a class="social" href="https://twitter.com/sunfoundation"><span class="sficon-twitter"></span></a>' +
'      <a class="social" href="https://plus.google.com/+sunlightfoundation"><span class="sficon-google-plus"></span></a>' +
'      <a class="branding-bar_trigger" data-bb-toggle=".bb_wrapper" href="https://sunlightfoundation.com/about/">About Sunlight Foundation</a>' +
'    </div>' +
'    <div class="branding-bar_logo">' +
'      <span class="branding-bar_productof">a product of </span>' +
'      <a class="branding-bar_sunlight-logo" href="https://www.sunlightfoundation.com">Sunlight Foundation</a>' +
'    </div>' +
'  </div>' +
'';

var selectors, featuredTools;

// This kicks off the panel render
initialize();
