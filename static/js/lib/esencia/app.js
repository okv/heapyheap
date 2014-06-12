'use strict';

define([
	'baDebug', 'backbone', 'underscore'
], function(
	debug, backbone, _
) {
	/**
	 * App extend default backbone router
	 */

	var App = {
		root: '/',
		modulesPath: 'modules/',
		defaultModuleName: 'main',
		pushState: false,
		namedParameters: false,
		autoloadModules: true,
		config: {},
		onModuleError: function() {},
		nowhereUrl: '___'
	};

	var appOptions = ['root', 'modulesPath', 'defaultModuleName', 'pushState',
		'namedParameters', 'autoloadModules', 'debug', 'config', 'onModuleError'];
	/*
	 * Override `constructor`
	 * @param {Object} [options]
	 */

	App.constructor = function(options) {
		options = options || {};
		this._configure(options);

		this.history = backbone.history;

		/*
		 * All query parameters can be passed in a single hash using the key
		 * referenced from the route definition (backbone queryparams will
		 * do it for us)
		 */

		backbone.Router.namedParameters = this.namedParameters;

		backbone.Router.apply(this, arguments);

		if (options.autoloadModules) {
			this.route('*url', function(params) {
				this.setModule(params);
			});
		}
	};

	/*
	 * Configure app with options
	 */

	App._configure = function(options) {
		if (this.options) options = _.extend({}, _.result(this, 'options'), options);
		_.extend(this, _.pick(options, appOptions));
		this.options = options;
		this.controllersHash = {};
		this.urlParams = {};
		this.modules = {};
	};

	/*
	 * Add controller to app and bind it
	 *
	 * @param {Controller} controller
	 */

	App.controller = function(controller, options) {
		var app = this;

		options = options || {};

		var name = controller.name || '';

		if (name) {
			if (name in this.controllersHash) {
				throw new Error('Duplicate controller with name `' + name + '`.');
			}

			this.controllersHash[name] = controller;
		}

		// add link to urlParams to controller
		controller.urlParams = this.urlParams;

		// bind controller to route
		if (!_.isUndefined(controller.url)) {
			this.route(controller.url, name, function(params) {
				// clean old values from urlParams object
				var urlParams = app.urlParams;
				for (var i in urlParams) {
					delete urlParams[i];
				}

				// populate urlParams with new params
				_(urlParams).extend(controller.defaultUrlParams, params);

				// process controllers chain
				app.processController(controller);
			});
		}

		// process controllers chain in force mode
		if (options.process) {
			this.processController(controller);
		}

		return this;
	};

	/*
	 * Add set of controllers to app and bind them
	 *
	 * @param {Controller[]} controllers
	 */

	App.controllers = function(controllers) {
		if (!_.isArray(controllers)) {
			controllers = [controllers];
		}

		_(controllers).each(this.controller, this);

		return this;
	};

	/*
	 * Process parent controllers chain, set parent to
	 *  controller and process controller with stage after it
	 *
	 * @param {Controller} controller
	 * @param {String} [stage]
	 * @param {Function} callback
	 */

	App.processController = function(controller, stage, callback) {
		stage = stage || 'render';

		var parentName = controller.parentName;

		if (parentName) {
			var parentStage = 'render';

			if (_.isObject(parentName)) {
				parentStage = _.toArray(parentName)[0];
				parentName = _.key(parentName)[0];
			}

			// get parent controller
			var parent = controller.parent || this.controllersHash[parentName];
			if (!parent) {
				throw new Error(
					'Parent controller with name `' + parentName + '` is undefined.'
				);
			}

			if (parent.view && parent.view.isAttached()) parentStage = 'renderOnly';

			this.processController(parent, parentStage, function() {
				if (!controller.parent) {
					controller.parent = parent;
				}

				controller.process(stage, callback);
			});
		} else {
			controller.process(stage, callback);
		}
	};

	/*
	 * Override `route` to add middleware processing functionality
	 */

	App.route = function(url, name, callback) {
		var app = this;

		if (_.isFunction(name)) {
			callback = name;
			name = '';
		}

		backbone.Router.prototype.route.call(this, url, name, function() {
			var args = arguments;

			app._defaultMiddleware({
				url: url,
				name: name,
				callback: callback
			}, function() {
				callback.apply(app, args);
			});
		});
	};

	/*
	 * Override `navigate`
	 * @param {String} fragment
	 * @param {Object} [options] - hash of params
	 * @param {Object} [options.qs] - query string hash
	 */

	App.navigate = function(fragment, options) {
		options = options || {};

		if (fragment.indexOf(this.root) === 0) {
			fragment = fragment.substring(this.root.length);
		}

		// force to go to the selected fragment even if we currently on it
		// TODO: block nowhere url via `execute` after upgrade backbone (1.1.1)
		if (options.force) {
			this.navigate(this.nowhereUrl, {replace: true, trigger: false});
			this.navigate(fragment, _(options).omit('force'));
		}

		// set `trigger` to true by default
		options = _(options || {}).defaults({
			trigger: true,
			params: {}
		});

		// add support of query string using `toFragment` from backbone.queryparams
		var qs = options.qs;

		if (qs) {
			// reject undefined and null qs parameters
			_(qs).each(function(val, key, qs) {
				if (val === undefined || val === null) delete qs[key];
			});

			fragment = this.toFragment(fragment, qs);

			delete options.qs;
		}

		backbone.Router.prototype.navigate.call(this, fragment, options);
	};


	/*
	 * Default middleware function
	 */

	App._defaultMiddleware = function(route, next) {
		next();
	};

	/**
	 * Use passed function as `middleware`
	 *
	 * @param {Function} middleware - middleware function,
	 * `route` and `next` will be passed as arguments.
	 * context (`this`) is link to the app object.
	 */

	App.middleware = function(middleware) {
		var app = this;

		var defaultMiddleware = this._defaultMiddleware;

		this._defaultMiddleware = function(route, next) {
			defaultMiddleware.call(app, route, function() {
				middleware.call(app, route, next);
			});
		};

		return this;
	};

	/*
	 * Require module file and init it
	 * @param {String} params.url Url without query string
	 */

	App.setModule = function(params) {
		var app = this;

		var url = params.url;
		delete params.url;

		var moduleName = _(url.split('/')).find(_.identity) || this.defaultModuleName;

		// require module file
		require([this.modulesPath + moduleName], function(moduleInit) {
			// if module is loaded first time
			if (!app.modules[moduleName]) {
				// init it
				moduleInit(app);

				// set module init flag to true
				app.modules[moduleName] = true;

				// and navigate again with force flag
				app.navigate(url, {
					replace: true,
					force: true,
					qs: params
				});
			}
		}, this.onModuleError);
	};

	/*
	 * Start routes handling
	 */

	App.start = function() {
		backbone.history.start({
			pushState: this.pushState,
			root: this.root
		});
	};

	return backbone.Router.extend(App);
});