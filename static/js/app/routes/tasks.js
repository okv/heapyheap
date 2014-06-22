'use strict';

define([
	'app/views/tasks/list', 'app/views/tasks/view', 'app/views/tasks/form'
], function(
	TasksListView, TasksView, TasksForm
) {

	return function(router) {

		var collections = router.app.collections;

		router.route({
			url: 'tasks',
			name: 'tasksList',
			parentName: 'mainLayout'
		}, function(qs) {
			var self = this,
				filters = qs || {};
			collections.tasks.fetch({data: filters, success: function(collection) {
				self.view = new TasksListView({
					el: '.main-layout',
					collection: collection,
					data: {filters: filters}
				}).render();
			// reset collection coz client merge breaks server sorting
			}, reset: true});
		});

		router.route({
			url: 'tasks/:id',
			parentName: 'tasksList'
		}, function(id) {
			var model = collections.tasks.get(id);
			if (!model) {
				// TODO: add method for instaces creation
				model = new collections.tasks.model({id: id});
				collections.tasks._prepareModel(model);
			}
			// always fetch latest model from server before viewing it
			model.fetch({success: function(model) {
				new TasksView({el: '#task-full', model: model}).render();
			}});
		});

		router.route({
			url: 'tasks/:id/edit',
			parentName: 'tasksList'
		}, function(id) {
			var model = collections.tasks.get(id);
			if (!model) {
				// TODO: add method for instaces creation
				model = new collections.tasks.model({id: id});
				collections.tasks._prepareModel(model);
			}
			model.fetch({success: function(model) {
				new TasksForm({el: '#task-full', model: model}).render();
			}});
		});

		router.route({
			url: 'tasks/add',
			parentName: 'tasksList'
		}, function(qs) {
			// TODO: add method for instaces creation
			var model = new collections.tasks.model(qs);
			collections.tasks._prepareModel(model);
			new TasksForm({el: '#task-full', model: model}).render();
		});

	};
});
