'use strict';

/**
 * Extends default backbone router
 */
define(['backbone', 'underscore'], function(backbone, _) {
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
			self._beforeRouteCallback(route, function() {
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
		// add support of query string using `toFragment` from backbone.queryparams
		if (options.qs) {
			// reject falsy (except zero) qs parameters
			_(options.qs).each(function(val, key, obj) {
				if (!val && val !== 0) delete obj[key];
			});
			fragment = this.toFragment(fragment, options.qs);
			delete options.qs;
		}
		superNavigate.call(this, fragment, options);
	};

	Router._beforeRouteCallback = function(route, callback) {
		callback();
	};

	Router.use = function(middleware) {
		var oldBeforeRouteCallback = this._beforeRouteCallback;
		this._beforeRouteCallback = function(route, callback) {
			oldBeforeRouteCallback(route, function() {
				middleware(route, callback);
			});
		};
	};

	return backbone.Router.extend(Router);
});
