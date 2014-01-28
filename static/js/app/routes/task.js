'use strict';

define(['app/views/task'], function(task) {
	var route = {};
	route.url = 'tasks/:id';
	route.name = 'task';
	var view = null;
	route.callback = function(id) {
		var self = this;
		if (view) view.off();
		var model = this.models.tasks.get(id);
		if (!model) {
			// TODO: add method for instaces creation
			model = new this.models.tasks.model({id: id});
			this.models.tasks._prepareModel(model);
		}
		// always fetch latest model from server before viewing it
		model.fetch({success: function(model) {
			console.log('>>> fetched model = ', model.toJSON())
			view = new (task(self))({el: '#task-full', model: model}).render();
		}});
	};
	return route;
});
