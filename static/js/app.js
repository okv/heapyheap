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
	'app/views/base',
	'app/models/tasks', 'app/models/projects', 'app/models/users',
	'jquery'
], function(
	backbone, _,
	Service, Router,
	mainRoute, tasksRoute,
	authMiddleware, routeRelationsMiddleware,
	BaseView,
	TasksCollection, ProjectsCollection, UsersCollection,
	$
) {
	$(document).ready(function() {
		var app = {
			router: new Router(),
			service: new Service({socket: backbone.io.connect()}),
			models: {},
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
			app.models.tasks = new TasksCollection();
			app.models.projects = new ProjectsCollection();
			app.models.users = new UsersCollection();
			next = _.after(2, next);
			// fetch all models which will be synced in backgroud during all
			// app life cycle
			app.models.projects.fetch({success: next});
			app.models.users.fetch({success: next});
		}}));
		app.router.use(routeRelationsMiddleware());

		// routes
		mainRoute(app.router);
		tasksRoute(app.router);

		Backbone.history.start({pushState: true});
	});
});
