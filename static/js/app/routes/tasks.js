'use strict';

define(['underscore'], function(_) {
	var route = {};
	route.url = 'tasks';
	route.name = 'tasks';
	route.callback = function(qs) {
		var filters = qs || {};
		var self = this;
		self.views.tasks.render(filters);
	};
	return route;
});
