'use strict';

require([
	'backbone', 'underscore',
	'app/service',
	'app/routes/main', 'app/routes/login', 'app/routes/tasks',
	'app/views/index',
	'app/models/tasks',
	'jquery'
], function(
	backbone, _,
	Service,
	main, login, tasks,
	views,
	Tasks,
	$
) {
	$(document).ready(function() {
		var socket = backbone.io.connect();
		var Router = {};
		var superRoute = backbone.Router.prototype.route;
		Router.route = function(route) {
			var oldCallback = route.callback;
			// override callback for redirect anonymous to login page
			route.callback = function() {
				if (!this.user && route.name != 'login') {
					this.navigate('login', {trigger: true});
				} else {
					oldCallback.apply(this, arguments);
				}
			}
			superRoute.call(this, route.url, route.name, route.callback);
		};
		Router = backbone.Router.extend(Router);
		var router = new Router();
		router.user = null;
		router.service = new Service({socket: socket});
		router.service.onLogin = function(user) {
			router.user = user;
		};
		router.models = {};
		router.models.tasks = new Tasks();
		router.views = {
			login: new (views.Login(router))({el: 'body'}),
			tasks: new (views.Tasks(router))({
				el: 'body',
				collection: router.models.tasks
			})
		};
		router.route(main);
		router.route(login);
		router.route(tasks);
		Backbone.history.start({pushState: true});
	});
});
