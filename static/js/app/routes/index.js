'use strict';

require([
	'backbone', 'underscore',
	'app/routes/main', 'app/routes/login', 'app/routes/tasks',
	'app/views/index',
	'jquery'
], function(
	backbone, _,
	main, login, tasks,
	views,
	$
) {
	$(document).ready(function() {
		var router = new backbone.Router();
		router.user = null;
		router.views = {
			login: new views.Login({el: 'body'}),
			tasks: new views.Tasks({el: 'body'})
		};
		main(router);
		login(router);
		tasks(router);
		Backbone.history.start();
	});
});
