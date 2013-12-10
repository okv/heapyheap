'use strict';

define(['underscore'], function(_) {
	var route = {};
	route.url = 'tasks';
	route.name = 'tasks';
	route.callback = function() {
		var self = this;
		// fetch all required models
		this.models.projects.fetch({
			success: function() {
				// render
				self.views.tasks.render();
			}
		});
	};
	return route;
});
