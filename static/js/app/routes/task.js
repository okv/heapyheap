'use strict';

define(['app/views/task'], function(TaskView) {
	var route = {};
	route.url = 'tasks/:id';
	route.name = 'task';
	var view = null;
	route.callback = function(id) {
		var self = this;
		if (view) view.detach();
		var model = this.collections.tasks.get(id);
		if (!model) {
			// TODO: add method for instaces creation
			model = new this.collections.tasks.model({id: id});
			this.collections.tasks._prepareModel(model);
		}
		// always fetch latest model from server before viewing it
		model.fetch({success: function(model) {
			console.log('>>> fetched model = ', model.toJSON())
			view = new TaskView({el: '#task-full', model: model}).render();
		}});
	};
	return route;
});
