'use strict';

define([], function() {
	var route = {};
	route.url = '';
	route.name = 'main';
	route.callback = function() {
		if (!this.user) {
			this.navigate('login', {trigger: true});
		} else {
			this.navigate('tasks', {trigger: true});
		}
	};
	return route;
});
