'use strict';

define([], function() {
	var route = {};
	route.url = '';
	route.name = 'main';
	route.callback = function() {
		if (!this.user) {
			this.navigate('login');
		} else {
			this.navigate('tasks');
		}
	};
	return route;
});
