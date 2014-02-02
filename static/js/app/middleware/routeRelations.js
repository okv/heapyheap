'use strict';

/**
 * Route relations middleware
 */
define(function() {
	return function() {

		return function(route, next) {
			console.log('before route %s', route.name);
			console.log(
				'going to %s (it has parent %s)',
				route.name,
				route.parent && route.parent.name
			);
			if (route.parent && !isRendered(route.parent)) {
				route.parent.callback();
				waitForRender(route.parent, next);
			} else {
				next();
			}
		};

		// wait until route will be rendered
		function waitForRender(route, callback) {
			setTimeout(function() {
				console.log('wait until %s will be rendered', route.name);
				isRendered(route) ? callback() : waitForRender(route, callback);
			}, 10);
		}
		// is route rendered
		function isRendered(route) {
			console.log(
				'%s is rendered %s ',
				route.name,
				route.view && route.view.isRendered()
			);
			return route.view && route.view.isRendered();
		}
	};
});