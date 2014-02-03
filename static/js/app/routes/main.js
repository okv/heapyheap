'use strict';

define(['app/views/login'], function(LoginView) {

	return function(router) {

		router.route('', 'main', function() {
			router.navigate(router.user ? router.defaultRoute : 'login');
		});

		router.route('login', 'login', function() {
			new LoginView({el: 'body'}).render();
		});

	};

});
