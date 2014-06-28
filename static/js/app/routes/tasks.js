'use strict';

define([
	'underscore', 'app/views/tasks/list', 'app/views/tasks/view',
	'app/views/tasks/form', 'app/collections/comments'
], function(
	_, TasksListView, TasksView,
	TasksForm, CommentsCollection
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
					collections: {tasks: collection},
					data: {filters: filters}
				}).render();
			}});
		});

		router.route({
			url: 'tasks/:id',
			parentName: 'tasksList'
		}, function(id) {
			var task = collections.tasks.get(id) ||
				collections.tasks.create({id: id}, {local: true}),
				comments = new CommentsCollection();
			var callback = _.after(2, function() {
				new TasksView({
					el: '#task-full',
					models: {task: task},
					collections: {comments: comments}
				}).render();
			});
			task.fetch({success: callback});
			comments.fetch({data: {taskId: id}, success: callback});
		});

		router.route({
			url: 'tasks/:id/edit',
			parentName: 'tasksList'
		}, function(id) {
			var task = collections.tasks.get(id) ||
				collections.tasks.create({id: id}, {local: true});
			task.fetch({success: function(model) {
				new TasksForm({el: '#task-full', models: {task: model}}).render();
			}});
		});

		router.route({
			url: 'tasks/add',
			parentName: 'tasksList'
		}, function(qs) {
			var task = collections.tasks.create(qs, {local: true});
			new TasksForm({el: '#task-full', models: {task: task}}).render();
		});

	};
});
