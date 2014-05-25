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
		function waitForRender(route, callback, start) {
			if (!start) start = Date.now();
			setTimeout(function() {
				console.log('wait until %s will be rendered', route.name);
				if (isRendered(route)) {
					callback();
				} else {
					if (Date.now() - start > 1000) throw new Error(
						'Waiting timeout for render of ' + route.name + ' exceeded'
					);
					waitForRender(route, callback, start);
				}
			}, 10);
		}
		// is route rendered
		function isRendered(route) {
			console.log(
				'%s is rendered: %s ',
				route.name,
				Boolean(route.view && route.view.isRendered())
			);
			return route.view && route.view.isRendered();
		}
	};
});