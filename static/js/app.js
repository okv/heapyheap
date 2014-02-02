'use strict';

requirejs.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app',
		socketio: '/socket.io/socket.io.js',
		backboneio: '/socket.io/backbone.io.js'
	},
	shim: {
		underscore : {
			exports : '_'
		},
		_backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		backboneio: {
			deps: ['_backbone'],
			exports: 'Backbone.io'
		}
	}
});

require([
	'backbone', 'underscore',
	'app/service', 'app/routes/router',
	'app/routes/main', 'app/routes/login', 'app/routes/tasks', 'app/routes/task',
	'app/views/base', 'app/views/login', 'app/views/tasks',
	'app/models/tasks', 'app/models/projects', 'app/models/users',
	'jquery'
], function(
	backbone, _,
	Service, Router,
	main, login, tasks, task,
	BaseView, LoginView, TasksView,
	Tasks, Projects, Users,
	$
) {
	$(document).ready(function() {
		var socket = backbone.io.connect();

		var router = new Router();

		// auth middleware
		router.use(function(route, next) {
			console.log('auth middleware')
			if (!router.user && !isPublic(route)) {
				router.returnUrl = window.location.pathname + window.location.search;
				router.navigate('login');
			} else if (router.user && route.name !== 'login') {
				afterLogin(next);
			} else {
				next();
			}
		});
		function isPublic(route) {
			return _(['login', 'main']).contains(route.name);
		}
		// some global initialization after user logged in
		var isAfterLoginCalled = false;
		function afterLogin(callback) {
			if (!isAfterLoginCalled) {
				isAfterLoginCalled = true;
				router.collections.tasks = new Tasks();
				router.collections.projects = new Projects();
				router.collections.users = new Users();
				callback = _.after(2, callback);
				// fetch all models which will be synced in backgroud during all
				// app life cycle
				router.collections.projects.fetch({success: callback});
				router.collections.users.fetch({success: callback});
			} else {
				callback();
			}
		}

		// route relations middleware
		router.use(function(route, next) {
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
		});
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

		router.user = null;
		router.defaultRoute = 'tasks';
		router.service = new Service({socket: socket});

		router.collections = {};

		BaseView.prototype.router = router;
		BaseView.prototype.collections = router.collections;

		router.route(main);
		router.route(login);
		router.route(tasks);
		// TODO: determine parents automatically (using rote names)
		task.parent = tasks;
		router.route(task);
		Backbone.history.start({pushState: true});
	});
});
