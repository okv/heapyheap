'use strict';

define(['app/views/task'], function(task) {
	var route = {};
	route.url = 'tasks/:id';
	route.name = 'task';
	route.callback = function(id) {
		if (this.views.task) this.views.task.unbind();
		this.views.task = new (task(this))({
			el: '#task-full',
			model: this.models.tasks.get(id)
		});
		this.views.task.render();
	};
	return route;
});
