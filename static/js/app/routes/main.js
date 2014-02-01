'use strict';

define([], function() {
	var route = {};
	route.url = '';
	route.name = 'main';
	route.callback = function() {
		this.navigate(this.user ? this.defaultRoute : 'login');
	};
	return route;
});
