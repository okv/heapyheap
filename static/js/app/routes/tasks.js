'use strict';

define([], function() {
	return function(router) {
		router.route('tasks', 'tasks', function() {
			router.models.tasks.fetch();
			router.views.tasks.render();
		});
	};
});
