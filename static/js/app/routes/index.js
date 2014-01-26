'use strict';

require([
	'backbone', 'underscore',
	'app/service', 'app/routes/router',
	'app/routes/main', 'app/routes/login', 'app/routes/tasks', 'app/routes/task',
	'app/views/login', 'app/views/tasks',
	'app/models/tasks', 'app/models/projects',
	'jquery'
], function(
	backbone, _,
	Service, Router,
	main, login, tasks, task,
	loginView, tasksView,
	Tasks, Projects,
	$
) {
	$(document).ready(function() {
		var socket = backbone.io.connect();

		var router = new Router();
		router.beforeRouteCallback = function(route, callback) {
			console.log('>>> before route = ', route.name)
			if (!this.user && route.name !== 'login') {
				this.returnUrl = window.location.pathname + window.location.search;
				this.navigate('login');
			} else if (this.user && route.name !== 'login') {
				afterLogin(callback);
			} else {
				callback();
			}
		};
		// some global initialization after user logged in
		var isAfterLoginCalled = false;
		function afterLogin(callback) {
			if (!isAfterLoginCalled) {
				isAfterLoginCalled = true;
				router.models.tasks = new Tasks();
				router.models.projects = new Projects();
				callback = _.after(1, callback);
				// fetch all models which will be synced in backgroud during all
				// app life cycle
				router.models.projects.fetch({success: callback});
				// init some views
				router.views.tasks = new (tasksView(router))({
					el: 'body',
					collection: router.models.tasks
				});
			} else {
				callback();
			}
		};

		router.user = null;
		router.service = new Service({socket: socket});
		router.service.onLogin = function(user) {
			router.user = user;
		};

		router.models = {};
		router.views = {};
		router.views.login = new (loginView(router))({el: 'body'});

		router.route(main);
		router.route(login);
		router.route(tasks);
		router.route(task);
		Backbone.history.start({pushState: true});
	});
});
