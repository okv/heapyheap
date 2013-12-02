'use strict';

define([
	'backbone', 'app/template', 'underscore'
], function(
	backbone, template, _
) {
	return function(router) {
		var View = {};

		View.events = {
			'change .task-filters': 'onFilterChange',
			'click #tasks-table-body tr': 'onSelectTask',
		};

		View.onFilterChange = function() {
			var filters = {
				project: this.$('#filter-project').val(),
				version: this.$('#filter-version').val(),
				assignee: this.$('#filter-assignee').val(),
				status: this.$('#filter-status').val(),
				limit: 25
			};
			_(filters).each(function(val, key, obj) {
				if (val === '') delete obj[key];
			});
			this.collection.fetch({data: filters});
		};

		View.onSelectTask = function(event) {
			router.navigate(
				'tasks/' + this.$(event.target).parent().data('task-id')
			);
		};

		View.initialize = function() {
			var self = this;
			this.collection.on('add', function(model) {
				self.$('#tasks-table-body').append(
					template.render('tasks/tableRow', {task: model.toJSON()})
				);
				model.on('change:title, change:status', function(model) {
					self.$(
						'#tasks-table-body tr[data-task-id=' + model.get('id') + ']'
					).replaceWith(
						template.render('tasks/tableRow', {task: model.toJSON()})
					);
				});
			});
			this.collection.on('remove', function(model) {
				self.$(
					'#tasks-table-body tr[data-task-id=' + model.get('id') + ']'
				).remove();
			});
			this.collection.on('backend:update', function(model) {
				this.get(model.id).set(model);
			});
			// temporary
			this.$el.on('click', '#task-change-status', function() {
				var model = self.collection.get(1);
				model.set(
					'status',
					model.get('status') == 'waiting' ? 'in porgress' : 'waiting'
				);
				model.save();
			});
		};

		View.render = function() {
			this.$el.html(template.render('tasks'));
			this.$('.task-filters:first').change();
		};

		return backbone.View.extend(View);
	}
});
