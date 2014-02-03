'use strict';

define(['app/views/tasks', 'app/views/task'], function(TasksView, TaskView) {

	return function(router) {

		var app = router.app,
			collections = app.collections;

		router.route('tasks', 'tasks', function(qs) {
			var self = this,
				filters = qs || {};
			collections.tasks.fetch({data: filters, success: function(collection) {
				self.view = new TasksView({el: 'body', collection: collection}).render(filters);
			}});
		});

		router.route('task', 'tasks/:id', 'tasks', function(id) {
			var model = collections.tasks.get(id);
			if (!model) {
				// TODO: add method for instaces creation
				model = new collections.tasks.model({id: id});
				collections.tasks._prepareModel(model);
			}
			// always fetch latest model from server before viewing it
			model.fetch({success: function(model) {
				console.log('>>> fetched model = ', model.toJSON())
				new TaskView({el: '#task-full', model: model}).render();
			}});
		});

	};
});
