'use strict';

/**
 * Extends default backbone router
 */
define(['backbone', 'underscore'], function(backbone, _) {
	var Router = {};

	Router.initialize = function() {
		this.routes = {};
	};

	var superRoute = backbone.Router.prototype.route;
	Router.route = function(name, url, parent, callback) {
		if (_(parent).isFunction()) {
			callback = parent;
			parent = null;
		}

		var self = this,
			oldCallback = callback;

		var callback = function() {
			var args = arguments;
			self._beforeRouteCallback(route, function() {
				oldCallback.apply(route, args);
			});
		};

		var route = {url: url, name: name, callback: callback, router: self};

		if (this.routes[name]) throw new Error('Duplicate route ' + name);
		this.routes[name] = route;

		if (parent) {
			if (this.routes[parent]) {
				parent = this.routes[parent];
			} else {
				throw new Error(
					'Unrecognized parent router ' + parent + ' for ' + name
				);
			}
			route.parent = parent;
		}

		superRoute.call(this, url, name, callback);
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

	/**
	 * Use selected `middleware`, `route` and `next` will be passed as
	 * arguments. `middleware` context (`this`) is link to the current route
	 * object.
	 */
	Router.use = function(middleware) {
		var oldBeforeRouteCallback = this._beforeRouteCallback;
		this._beforeRouteCallback = function(route, callback) {
			oldBeforeRouteCallback.call(route, route, function() {
				middleware.call(route, route, callback);
			});
		};
	};

	return backbone.Router.extend(Router);
});
