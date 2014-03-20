;(function () {
  /*
   * Return the namespace that all html, css and js should use
   * This is a function so as to be a little less mutable
   */
  function namespace() {
    return "bb";
  }

  function version() {
    return '0.2.0';
  }

  /*
   * event support
   */

  // binds a single event
  function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, handler);
    }
  }

  // binds events to an array of elements elements
  function on(els, eventName, handler) {
    for(var i=0; i<els.length; i++) {
      addEventListener(els[i], eventName, handler);
    }
  }

  /*
   * class manipulation
   */

  function toggleClass(el, className) {
    if (el.classList) {
      el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = -1;
        for (var i = classes.length; i--;) {
          if (classes[i] === className)
            existingIndex = i;
        }
        if (existingIndex >= 0)
          classes.splice(existingIndex, 1);
        else
          classes.push(className);
      el.className = classes.join(' ');
    }
  }

  function addClass(el, className) {
      if (el.classList) {
        el.classList.add(className);
      }
      else {
        el.className += ' ' + className;
      }
  }

  function removeClass(el, className) {
      if (el.classList) {
        el.classList.remove(className);
      }
      else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
  }

  /*
   * XMLHttpRequest methods
   */

  function xhr(method, url, data, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    // some people say this trigger CORS.
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (method === 'POST') {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }
    request.onreadystatechange = function() {
      if (this.readyState === 4){
        if (this.status >= 200 && this.status < 400){
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
    scr.onload = function(){
      setTimeout(function(){
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
    return str.join("&");
  }

  /*
   * app-specific
   */

  // loads a link or script unless one ending with condition is found on the page.
  function conditionalGet(tagName, url, condition) {
    var already = false;
    if (typeof condition === 'object' && Object.prototype.toString.call(condition) === '[object Array]') {
      if (tagName == 'script'){
        selectors = condition.map(function(item){
          return tagName + '[src$="' + condition + '"]';
        });
      } else {
        selectors = condition.map(function(item){
          return tagName + '[href$="' + condition + '"]';
        });
      }
      condition = selectors.join(', ');
      already = document.querySelectorAll(condition).length
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
    post('http://sunlightfoundation.com/join/', data, function(err, resp) {
      if (err) {
        // resp is a string of err message
        var emailFormError = document.querySelector('.' + namespace() + '_email-form-fail');
        toggle(emailFormError, {
          add: 'is-true'
        });
      } else {
        var respData = JSON.parse(resp);
        var url = 'http://sunlightfoundation.com' + respData.redirect;

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

  var toggle = function(els, opts) {
    if (typeof opts.toggle === 'string'){ opts.toggle = [opts.toggle]; }
    if (typeof opts.add === 'string'){ opts.add = [opts.add]; }
    if (typeof opts.remove === 'string'){ opts.remove = [opts.remove]; }
    if (typeof els.length === 'undefined') { els = [els]; }
    var i, j;
    for(i=0; i<els.length; i++){
      if (opts.toggle) {
        for (j=0; j<opts.toggle.length; j++){
          toggleClass(els[i], opts.toggle[j]);
        }
      }
      opts.add && addClass(els[i], opts.add.join(' '));
      if (opts.remove) {
        for (j=0; j<opts.remove.length; j++){
          removeClass(els[i], opts.remove[j]);
        }
      }
    }
  };

  function initialize(){
    var bar = document.querySelector('[data-' + namespace() + '-brandingbar]');
    if (bar) {
      var panel = document.querySelector('#' + namespace() + '_panel');
      var url = 'https://sunlightfoundation.com/brandingbar/';
      var propertyId = bar.getAttribute('data-' + namespace() + '-property-id');
      var loadingStylesheet = conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + version() + '/css/brandingbar.css', ['brandingbar.css', 'brandingbar.min.css', 'brandingbar.min.css.gz']);
      var loadingDefaultStylesheet = false;
      // // comment this line in to load the twitter widgets platform
      // var loadingTwitter = conditionalGet('script', 'https://platform.twitter.com/widgets.js', 'platform.twitter.com/widgets.js');

      // set up bar
      if(!bar.innerHTML) {
        bar.innerHTML = render(barTemplate);
        loadingDefaultStylesheet = conditionalGet('link', 'https://s3.amazonaws.com/sunlight-cdn/brandingbar/' + version() + '/css/brandingbar-default.css');
      }
      // set up panel
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

      // bind events to show/hide the top panel
      on(brandingBarTriggers, 'click', function(ev){
        ev.preventDefault();
        toggle(brandingPane, {toggle: 'is-active'});
      });

      // bind events to show/hide the tools panels
      on(panelTriggers, 'click', function(ev){
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


      // update featured tools based on current site
      if (propertyId) {
        url += '?pid=' + propertyId;
        getJSONP(url, function(data) {
          var list = featuredTools.querySelector('ul');
          list.innerHTML = '';
          for (var i=0; i<data.length; i++) {
            list.innerHTML += render(toolTemplate, data[i]);
          }
        });
      }

      // ajax the signup form if cors support was detected
      if (supportsCORS()) {
        var form = document.querySelector('.' + namespace() + '_email-form');
        addEventListener(form, 'submit', function(ev) {
          ev.preventDefault();
          var email = form.querySelector('input[name=email]').value;
          var zipcode = form.querySelector('input[name=zipcode]').value;
          console.log(email + " " + zipcode);
          join('http://sunlightfoundation.com/subscribe/', email, zipcode);
        });
      }
    }
  }

  // this is the main panel template
  panelTemplate = '' +
  '  <button id="{{ namespace }}_close-panel" data-{{ namespace }}-toggle=".{{ namespace }}_wrapper">&times;</button>' +
  '  <div class="{{ namespace }}_panel-container">' +
  '    <div class="{{ namespace }}_about">' +
  '      <span class="{{ namespace }}_heading">About Sunlight Foundation</span>' +
  '      <p class="{{ namespace }}_description">Founded in 2006, the Sunlight Foundation is a nonpartisan nonprofit that uses cutting-edge technology and ideas to make government transparent and accountable. <a class="{{ namespace }}_link" href="http://sunlightfoundation.com/about">Learn more &raquo;</a></p>' +
  '' +
  '      <div class="{{ namespace }}_email">' +
  '        <span class="{{ namespace }}_heading">Stay informed about our work</span>' +
  '        <form class="{{ namespace }}_email-form" action="http://sunlightfoundation.com/join/" method="post">' +
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
  '            <a class="{{ namespace }}_tools-logo" href="http://opencongress.com">' +
  '            <img src="http://sunlight-cdn.s3.amazonaws.com/brandingbar/0.2.0/img/logo_opencongress.png" alt="Open Congress"/>' +
  '            </a>' +
  '            <p class="{{ namespace }}_description">' +
  '              <a class="{{ namespace }}_link" href="http://opencongress.com">OpenCongress</a> allows anyone to follow legislation in Congress, from bill introduction to floor votes. Learn more about the issues you care about.' +
  '            </p>' +
  '          </li>' +
  '          <li>' +
  '            <a class="{{ namespace }}_tools-logo" href="http://scout.sunlightfoundation.com">' +
  '              <img src="http://sunlight-cdn.s3.amazonaws.com/brandingbar/0.2.0/img/logo_scout.png" alt="Scout"/>' +
  '            </a>' +
  '            <p class="{{ namespace }}_description">' +
  '              <a class="{{ namespace }}_link" href="http://scout.sunlightfoundation.com">Scout</a> is a rapid notification service that allows anyone to create customized email or text alerts on actions Congress takes on an issue or a specific bill.' +
  '            </p>' +
  '          </li>' +
  '        </ul>' +
  '      </div>' +
  '      <div id="{{ namespace }}_more-tools" class="{{ namespace }}_tools-details is-hidden">' +
  '        <ul class="{{ namespace }}_tools-list">' +
  '          <li><a class="{{ namespace }}_link" href="http://www.opencongress.org">OpenCongress</a></li>' +
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

  // this is the template for an individual related tool
  toolTemplate = '' +
  '  <li>' +
  '    <a class="{{ namespace }}_tools_logo" href="{{ href }}">' +
  '      <img src="{{ img }}" alt="{{ name }}"/>' +
  '    </a>' +
  '    <p class="{{ namespace }}_description">' +
  '      {{ description }}' +
  '    </p>' +
  '  </li>' +
  '';

  // this is the template for the bar itself if it's empty
  barTemplate = '' +
  '  <div class="branding-bar_container">' +
  '    <div class="branding-bar_links">' +
  '      <a class="social" href="https://www.facebook.com/sunlightfoundation"><span class="icon icon-facebook"></span></a>' +
  '      <a class="social" href="https://twitter.com/sunfoundation"><span class="icon icon-twitter"></span></a>' +
  '      <a class="social" href="https://plus.google.com/+sunlightfoundation"><span class="icon icon-google-plus"></span></a>' +
  '      <a class="branding-bar_trigger" data-bb-toggle=".bb_wrapper" href="http://sunlightfoundation.com/about/">About Sunlight Foundation</a>' +
  '    </div>' +
  '    <div class="branding-bar_logo">' +
  '      <span class="branding-bar_productof">a product of </span>' +
  '      <a class="branding-bar_sunlight-logo" href="http://www.sunlightfoundation.com">Sunlight Foundation</a>' +
  '    </div>' +
  '  </div>' +
  '';

  // this kicks off the panel render
  initialize();

})();
