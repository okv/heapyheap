'use strict';

define([
	'app/views/login', 'app/views/layout/main'
], function(
	LoginView, MainLayoutView
) {

	return function(router) {

		var app = router.app;
		router.route({url: ''}, function() {
			router.navigate(app.currentUser ? app.defaultRoute : 'login');
		});

		router.route({url: 'login'}, function() {
			new LoginView({el: 'body'}).render();
		});

		router.route({name: 'mainLayout'}, function() {
			this.view = new MainLayoutView({el: 'body'}).render();
		});

	};

});
