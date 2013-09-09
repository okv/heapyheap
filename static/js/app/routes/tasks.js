'use strict';

define([], function() {
	return function(router) {
		router.route('tasks', 'tasks', function() {
			router.views.tasks.render();
		});
	};
});
