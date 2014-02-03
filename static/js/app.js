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
	'app/routes/main', 'app/routes/tasks',
	'app/middleware/auth', 'app/middleware/routeRelations',
	'app/views/base', 'app/views/login', 'app/views/tasks',
	'app/models/tasks', 'app/models/projects', 'app/models/users',
	'jquery'
], function(
	backbone, _,
	Service, Router,
	mainRoute, tasksRoute,
	authMiddleware, routeRelationsMiddleware,
	BaseView, LoginView, TasksView,
	TasksCollection, ProjectsCollection, UsersCollection,
	$
) {
	$(document).ready(function() {
		var socket = backbone.io.connect();

		var router = new Router();
		router.collections = {};

		router.use(authMiddleware({afterLogin: function(user, next) {
			// some global initialization after user logged in
			router.collections.tasks = new TasksCollection();
			router.collections.projects = new ProjectsCollection();
			router.collections.users = new UsersCollection();
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

		mainRoute(router);
		tasksRoute(router);

		Backbone.history.start({pushState: true});
	});
});
