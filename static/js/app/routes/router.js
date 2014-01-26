'use strict';

/**
 * Extends default backbone router
 */
define(['backbone'], function(backbone, Task) {
	var Router = {};

	Router.beforeRouteCallback = function(route, callback) {
		callback();
	};

	var superRoute = backbone.Router.prototype.route;
	Router.route = function(route) {
		var self = this,
			oldCallback = route.callback;
		route.callback = function() {
			var args = arguments;
			self.beforeRouteCallback(route, function() {
				oldCallback.apply(self, args);
			});
		}
		superRoute.call(this, route.url, route.name, route.callback);
	};

	var superNavigate = backbone.Router.prototype.navigate;
	// override `navigate`
	Router.navigate = function(fragment, options) {
		// set `trigger` to true by default
		options = _(options || {}).defaults({
			trigger: true
		});
		superNavigate.call(this, fragment, options);
	};

	return backbone.Router.extend(Router);
});
