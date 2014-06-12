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
	Router.route = function(params, callback) {
		params = params || {};

		var self = this,
			oldCallback = callback;

		var callback = function() {
			var args = arguments;
			self._beforeRouteCallback(route, function() {
				oldCallback.apply(route, args);
			});
		};

		var route = {callback: callback, router: self};
		if (params.name) {
			route.name = params.name;
			if (this.routes[route.name]) throw new Error(
				'Duplicate route ' + route.name
			);
			this.routes[route.name] = route;
		}

		if (params.parentName) {
			if (this.routes[params.parentName]) {
				route.parent = this.routes[params.parentName];
			} else {
				throw new Error(
					'Unrecognized parent router ' + params.parentName +
					' for ' + params.name || params.url
				);
			}
		}

		if ('url' in params) {
			route.url = params.url;
			var args = [params.url];
			if (params.name) args.push(params.name);
			args.push(callback);
			superRoute.apply(this, args);
		}
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
