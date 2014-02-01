'use strict';

define(['app/views/tasks'], function(TasksView) {
	var route = {};
	route.url = 'tasks';
	route.name = 'tasks';
	route.callback = function(qs) {
		var filters = qs || {};
		this.collections.tasks.fetch({data: filters, success: function(collection) {
			route.view = new TasksView({el: 'body', collection: collection}).render(filters);
		}});

	};
	return route;
});
