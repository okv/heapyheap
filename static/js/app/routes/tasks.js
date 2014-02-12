'use strict';

define([
	'app/views/tasks/list', 'app/views/tasks/view', 'app/views/tasks/form'
], function(
	TasksListView, TasksView, TasksForm
) {

	return function(router) {

		var app = router.app,
			models = app.models;

		router.route('tasksList', 'tasks', function(qs) {
			var self = this,
				filters = qs || {};
			models.tasks.fetch({data: filters, success: function(collection) {
				self.view = new TasksListView({el: 'body', collection: collection}).render(filters);
			// reset collection coz client merge breaks server sorting
			}, reset: true});
		});

		router.route('tasksView', 'tasks/:id', 'tasksList', function(id) {
			var model = models.tasks.get(id);
			if (!model) {
				// TODO: add method for instaces creation
				model = new models.tasks.model({id: id});
				models.tasks._prepareModel(model);
			}
			// always fetch latest model from server before viewing it
			model.fetch({success: function(model) {
				console.log('>>> fetched model = ', model.toJSON())
				new TasksView({el: '#task-full', model: model}).render();
			}});
		});

		router.route('tasksEdit', 'tasks/:id/edit', 'tasksList', function(id) {
			var model = models.tasks.get(id);
			if (!model) {
				// TODO: add method for instaces creation
				model = new models.tasks.model({id: id});
				models.tasks._prepareModel(model);
			}
			model.fetch({success: function(model) {
				new TasksForm({el: '#task-full', model: model}).render();
			}});
		});

		router.route('tasksAdd', 'tasks/add', 'tasksList', function(qs) {
			// TODO: add method for instaces creation
			var model = new models.tasks.model(qs);
			models.tasks._prepareModel(model);
			new TasksForm({el: '#task-full', model: model}).render();
		});

	};
});
