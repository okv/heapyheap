'use strict';

require([
	'backbone', 'underscore',
	'app/service',
	'app/routes/main', 'app/routes/login', 'app/routes/tasks',
	'app/views/index',
	'jquery'
], function(
	backbone, _,
	Service,
	main, login, tasks,
	views,
	$
) {
	$(document).ready(function() {
		var router = new backbone.Router();
		router.user = null;
		router.service = new Service();
		router.service.onLogin = function(user) {
			router.user = user;
		};
		router.views = {
			login: new (views.Login(router))({el: 'body'}),
			tasks: new (views.Tasks(router))({el: 'body'})
		};
		main(router);
		login(router);
		tasks(router);
		Backbone.history.start();
	});
});
