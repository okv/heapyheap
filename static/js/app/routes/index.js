'use strict';

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
				router.collections.tasks = new Tasks();
				router.collections.projects = new Projects();
				router.collections.users = new Users();
				callback = _.after(2, callback);
				// fetch all models which will be synced in backgroud during all
				// app life cycle
				router.collections.projects.fetch({success: callback});
				router.collections.users.fetch({success: callback});
				// init some views
				router.views.tasks = new TasksView({
					el: 'body',
					collection: router.collections.tasks
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

		router.collections = {};
		router.views = {};
		router.views.login = new LoginView({el: 'body'});

		BaseView.prototype.router = router;
		BaseView.prototype.collections = router.collections;

		router.route(main);
		router.route(login);
		router.route(tasks);
		router.route(task);
		Backbone.history.start({pushState: true});
	});
});
