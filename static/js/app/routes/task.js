'use strict';

define(['app/views/task'], function(task) {
	var route = {};
	route.url = 'tasks/:id';
	route.name = 'task';
	route.callback = function(id) {
		var self = this;
		if (this.views.task) this.views.task.off();
		// TODO: add method for instaces creation
		var model = new this.models.tasks.model({id: id});
		this.models.tasks._prepareModel(model);
		// always fetch latest model from server before viewing it
		model.fetch({success: function(model) {
			self.views.task = new (task(self))({
				el: '#task-full',
				model: model
			});
			self.views.task.render();
		}});
	};
	return route;
});
