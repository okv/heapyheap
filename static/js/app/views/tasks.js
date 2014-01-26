'use strict';

define([
	'backbone', 'app/template', 'underscore'
], function(
	backbone, template, _
) {
	return function(router) {
		var projects = router.models.projects,
			users = router.models.users;

		var View = {};

		View.events = {
			'change #filter-project': 'onProjectChange',
			'change #filter-version,#filter-assignee,#filter-status': 'onFilterChange',
			'click #tasks-table-body tr': 'onSelectTask'
		};

		View.onFilterChange = function() {
			var filters = {
				project: this.$('#filter-project').val(),
				version: this.$('#filter-version').val(),
				assignee: this.$('#filter-assignee').val(),
				status: this.$('#filter-status').val()
			};
			var self = this;
			// TODO: move filter of falsy value to `navigate`
			_(filters).each(function(val, key, obj) {
				if (val === '') delete obj[key];
			});
			// TODO: move `toFragment` call to `navigate`
			router.navigate(router.toFragment('tasks', filters), {trigger: false});
			this.collection.fetch({data: filters, success: function() {
				self.renderTableRows();
			}});
		};

		View.onSelectTask = function(event) {
			router.navigate(
				'tasks/' + this.$(event.target).parent().data('task-id')
			);
		};

		View.initialize = function() {
			var self = this;
			// sync tasks which changed remotely
			this.collection.on('add', function(model) {
				model.on('change:title, change:status', function(model) {
					self.$(
						'#tasks-table-body tr[data-task-id=' + model.get('id') + ']'
					).replaceWith(
						template.render('tasks/tableRow', {task: model.toJSON()})
					);
				});
			});
			this.collection.on('backend:update', function(model) {
				this.get(model.id).set(model);
			});
			// temporary
			this.$el.on('click', '#task-change-status', function() {
				var model = self.collection.get(1);
				model.set(
					'status',
					model.get('status') === 'waiting' ? 'in porgress' : 'waiting'
				);
				model.save();
			});

		};

		View.onProjectChange = function() {
			this.renderVersions();
			this.$('#filter-version').change();
		};

		View.renderProjects = function(selected) {
			this.$('#filter-project').html(template.render('ctrls/opts', {
				placeholder: 'Any project',
				opts: projects.map(function(project) {
					return project.get('name');
				}),
				selected: selected
			}));
		};

		View.renderVersions = function(selected) {
			var selProjectName = this.$('#filter-project').val(),
				selProject = projects.find(function(project) {
					return project.get('name') === selProjectName;
				});
			this.$('#filter-version').html(template.render('ctrls/opts', {
				placeholder: 'Any version',
				opts: selProject ? selProject.get('versions') : [],
				selected: selected
			}));
		};

		View.renderAssignees = function(selected) {
			this.$('#filter-assignee').html(template.render('ctrls/opts', {
				placeholder: 'Any assignee',
				opts: users.map(function(user) {
					return user.get('username');
				}),
				selected: selected
			}));
		};

		View.renderTableRows = function() {
			this.$('#tasks-table-body').html(template.render('tasks/tableRows', {
				tasks: this.collection.toJSON()
			}));
		};

		View.render = function(filters) {
			this.$el.html(template.render('tasks/index'));
			this.renderProjects(filters.project);
			this.renderVersions(filters.version);
			this.renderAssignees(filters.assignee);
			this.$('#filter-status').val(filters.status);
			this.onFilterChange();
		};

		return backbone.View.extend(View);
	}
});
