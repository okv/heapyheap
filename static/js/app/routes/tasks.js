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
			}});
		});

		router.route({
			url: 'tasks/:id',
			parentName: 'tasksList'
		}, function(id) {
			var model = collections.tasks.get(id) ||
				collections.tasks.create({id: id}, {local: true});
			model.fetch({success: function(model) {
				new TasksView({el: '#task-full', model: model}).render();
			}});
		});

		router.route({
			url: 'tasks/:id/edit',
			parentName: 'tasksList'
		}, function(id) {
			var model = collections.tasks.get(id) ||
				collections.tasks.create({id: id}, {local: true});
			model.fetch({success: function(model) {
				new TasksForm({el: '#task-full', model: model}).render();
			}});
		});

		router.route({
			url: 'tasks/add',
			parentName: 'tasksList'
		}, function(qs) {
			var model = collections.tasks.create(qs, {local: true});
			new TasksForm({el: '#task-full', model: model}).render();
		});

	};
});
