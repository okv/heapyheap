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
		var router = new backbone.Router();
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
		main(router);
		login(router);
		tasks(router);
		Backbone.history.start();
	});
});
