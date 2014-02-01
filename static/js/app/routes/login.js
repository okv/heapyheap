'use strict';

define(['app/views/login'], function(LoginView) {
	var route = {};
	route.url = 'login';
	route.name = 'login';
	route.callback = function() {
		new LoginView({el: 'body'}).render();
	};
	return route;
});
