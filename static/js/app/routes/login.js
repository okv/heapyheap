'use strict';

define([], function() {
	var route = {};
	route.url = 'login';
	route.name = 'login';
	route.callback = function() {
		this.views.login.render();
	};
	return route;
});
