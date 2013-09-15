'use strict';

define([], function() {
	var route = {};
	route.url = 'tasks';
	route.name = 'tasks';
	route.callback = function() {
		this.views.tasks.render();
	};
	return route;
});
