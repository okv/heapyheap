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
		var app = {
			router: new Router(),
			service: new Service({socket: backbone.io.connect()}),
			collections: {},
			user: null,
			defaultRoute: 'tasks',
			returnUrl: null
		};

		// share app with router and views
		app.router.app = app;
		BaseView.prototype.app = app;

		// middleware
		app.router.use(authMiddleware({afterLogin: function(user, next) {
			// some global initialization after user logged in
			app.collections.tasks = new TasksCollection();
			app.collections.projects = new ProjectsCollection();
			app.collections.users = new UsersCollection();
			next = _.after(2, next);
			// fetch all models which will be synced in backgroud during all
			// app life cycle
			app.collections.projects.fetch({success: next});
			app.collections.users.fetch({success: next});
		}}));
		app.router.use(routeRelationsMiddleware());

		// routes
		mainRoute(app.router);
		tasksRoute(app.router);

		Backbone.history.start({pushState: true});
	});
});
