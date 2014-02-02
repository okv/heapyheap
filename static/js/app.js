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
	'app/middleware/auth', 'app/middleware/routeRelations',
	'app/views/base', 'app/views/login', 'app/views/tasks',
	'app/models/tasks', 'app/models/projects', 'app/models/users',
	'jquery'
], function(
	backbone, _,
	Service, Router,
	main, login, tasks, task,
	authMiddleware, routeRelationsMiddleware,
	BaseView, LoginView, TasksView,
	Tasks, Projects, Users,
	$
) {
	$(document).ready(function() {
		var socket = backbone.io.connect();

		var router = new Router();
		router.collections = {};

		router.use(authMiddleware({afterLogin: function(user, next) {
			// some global initialization after user logged in
			router.collections.tasks = new Tasks();
			router.collections.projects = new Projects();
			router.collections.users = new Users();
			next = _.after(2, next);
			// fetch all models which will be synced in backgroud during all
			// app life cycle
			router.collections.projects.fetch({success: next});
			router.collections.users.fetch({success: next});
		}}));

		router.use(routeRelationsMiddleware());

		router.user = null;
		router.defaultRoute = 'tasks';
		router.service = new Service({socket: socket});

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
