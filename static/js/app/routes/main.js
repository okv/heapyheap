'use strict';

define(['app/views/login'], function(LoginView) {

	return function(router) {

		var app = router.app;

		router.route('index', '', function() {
			router.navigate(app.user ? app.defaultRoute : 'login');
		});

		router.route('login', 'login', function() {
			new LoginView({el: 'body'}).render();
		});

	};

});
