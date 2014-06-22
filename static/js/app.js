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
	'app/routes/users',
	'app/middleware/auth', 'app/middleware/routeRelations',
	'app/views/base',
	'app/collections/tasks', 'app/collections/projects', 'app/collections/users',
	'jquery'
], function(
	backbone, _,
	Service, Router,
	mainRoute, tasksRoute,
	usersRoute,
	authMiddleware, routeRelationsMiddleware,
	BaseView,
	TasksCollection, ProjectsCollection, UsersCollection,
	$
) {
	$(document).ready(function() {
		var storage = (
			typeof sessionStorage !== 'udefined' ? sessionStorage : null
		);
		var app = {
			router: new Router(),
			service: new Service({socket: backbone.io.connect()}),
			collections: {},
			models: {},
			currentUser: storage && storage.currentUser ? JSON.parse(
				storage.currentUser
			) : null,
			defaultRoute: 'tasks',
			returnUrl: null
		};

		app.login = function(data) {
			this.currentUser = data.user;
			this.setToken(data.token);
			if (storage) {
				storage.currentUser = JSON.stringify(data.user);
				storage.currentToken = data.token;
			}
		};

		var currentToken = storage ? storage.currentToken : null;
		app.setToken = function(token) {
			currentToken = token;
		};
		// patch sync for always send token
		var sync = Backbone.sync;
		Backbone.sync = function(method, model, options) {
			options = _(options).clone();
			options.token = currentToken;
			sync.call(this, method, model, options);
		};

		app.logout = function() {
			this.setToken(null);
			delete this.currentUser;
			if (storage) {
				delete storage.currentUser;
				delete storage.currentToken;
			}
			this.router.navigate('');
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
		usersRoute(app.router);

		Backbone.history.start({pushState: true});
	});
});
