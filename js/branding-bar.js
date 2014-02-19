(function () {

    function addEventListener(el, eventName, handler) {
      if (el.addEventListener) {
        el.addEventListener(eventName, handler);
      } else {
        el.attachEvent('on' + eventName, handler);
      }
    }

    function toggleClass(el, className) {
        return function () {
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
        };
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

    var brandingPane = document.querySelector('.bb_wrapper');
    var brandingBarTrigger = document.getElementById('branding-bar-trigger');
    var brandingBarClose = document.getElementById('bb_close-panel');

    var featuredTools = document.getElementById('bb_featured-tools');
    var featuredToolsTrigger = document.getElementById('bb_featured-tools-heading');

    var moreTools = document.getElementById('bb_more-tools');
    var moreToolsTrigger = document.getElementById('bb_more-tools-heading');

    addEventListener(brandingBarTrigger, 'click', toggleClass(brandingPane, 'is-active'));
    addEventListener(brandingBarClose, 'click', toggleClass(brandingPane, 'is-active'));

    // addEventListener(featuredToolsTrigger, 'click', function() {
    //     featuredToolsTrigger.classList.remove('inactive');
    //     moreToolsTrigger.classList.add('inactive');

    //     moreTools.classList.add('is-hidden');
    //     moreTools.classList.remove('bb_fade-animation');
    //     featuredTools.classList.remove('is-hidden');
    //     featuredTools.classList.add('bb_fade-animation');
    // });

    // addEventListener(moreToolsTrigger, 'click', function() {
    //     moreToolsTrigger.classList.remove('inactive');
    //     featuredToolsTrigger.classList.add('inactive');

    //     featuredTools.classList.add('is-hidden');
    //     featuredTools.classList.remove('bb_fade-animation');
    //     moreTools.classList.remove('is-hidden');
    //     moreTools.classList.add('bb_fade-animation');
    // });


 // IE 8+ Version

    addEventListener(featuredToolsTrigger, 'click', function() {
        removeClass(featuredToolsTrigger, 'is-inactive');
        addClass(moreToolsTrigger, 'is-inactive');

        addClass(moreTools, 'is-hidden');
        removeClass(moreTools, 'bb_fade-animation');
        removeClass(featuredTools, 'is-hidden');
        addClass(featuredTools, 'bb_fade-animation');
    });

    addEventListener(moreToolsTrigger, 'click', function() {
        removeClass(moreToolsTrigger, 'is-inactive');
        addClass(featuredToolsTrigger, 'is-inactive');

        addClass(featuredTools, 'is-hidden');
        removeClass(featuredTools, 'bb_fade-animation');
        removeClass(moreTools, 'is-hidden');
        addClass(moreTools, 'bb_fade-animation');
    });

})();