'use strict';

define([], function() {
	var route = {};
	route.url = 'tasks';
	route.name = 'tasks';
	route.callback = function() {
		this.models.tasks.fetch();
		this.views.tasks.render();
	};
	return route;
});
