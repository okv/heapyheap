'use strict';

define([], function() {
	var route = {};
	route.url = 'tasks/:id';
	route.name = 'task';
	route.callback = function(id) {
		alert(id);
	};
	return route;
});
