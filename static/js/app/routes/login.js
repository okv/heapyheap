'use strict';

define([], function() {
	return function(router) {
		router.route('login', 'login', function() {
			router.views.login.render();
		});
	};
});
