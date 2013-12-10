'use strict';

define([
	'backbone', 'app/template', 'underscore'
], function(
	backbone, template, _
) {
	return function(router) {
		var projects = router.models.projects;

		var View = {};

		View.events = {
			'change .task-filters': 'onFilterChange',
			'click #tasks-table-body tr': 'onSelectTask',
			'change #filter-project': 'onProjectChange'
		};

		View.onFilterChange = function() {
			var filters = {
				project: this.$('#filter-project').val(),
				version: this.$('#filter-version').val(),
				assignee: this.$('#filter-assignee').val(),
				status: this.$('#filter-status').val(),
				limit: 10
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

		View.onProjectChange = function() {
			var selProjectName = this.$('#filter-project').val(),
				selProject = projects.find(function(project) {
					return project.toJSON().name == selProjectName;
				});
			this.$('#filter-version').html(template.render('ctrls/opts', {
				placeholder: 'Any version',
				opts: selProject ? selProject.toJSON().versions : []
			}));
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

			this.$('#filter-project').html(template.render('ctrls/opts', {
				placeholder: 'Any project',
				opts: projects.map(function(project) {
					return project.toJSON().name;
				})
			}));

			this.$('.task-filters:first').change();
		};

		return backbone.View.extend(View);
	}
});
