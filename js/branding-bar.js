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
			el.classList.toggle(className);
		};
	}

	var brandingPane = document.getElementById('branding-bar-wrapper');
	var brandingBarTrigger = document.getElementById('branding-bar-trigger');

	var featuredTools = document.getElementById('bb-featured-tools');
	var featuredToolsTrigger = document.getElementById('bb-featured-tools-heading');

	var moreTools = document.getElementById('bb-more-tools');
	var moreToolsTrigger = document.getElementById('bb-more-tools-heading');

	addEventListener(brandingBarTrigger, 'click', toggleClass(brandingPane, 'is-active'));

	addEventListener(featuredToolsTrigger, 'click', function() {
		featuredToolsTrigger.classList.remove('inactive');
		moreToolsTrigger.classList.add('inactive');

		moreTools.classList.add('is-hidden');
		featuredTools.classList.remove('is-hidden');
	});

	addEventListener(moreToolsTrigger, 'click', function() {
		moreToolsTrigger.classList.remove('inactive');
		featuredToolsTrigger.classList.add('inactive');

		featuredTools.classList.add('is-hidden');
		moreTools.classList.remove('is-hidden');
	});	

})();