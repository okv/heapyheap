'use strict';

define(['app/views/base'], function(ParentView) {
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
		// TODO: move `toFragment` call to `navigate`
		this.router.navigate('tasks', {trigger: false, qs: filters});
		this.collection.fetch({data: filters, success: function() {
			self.renderTableRows();
		}});
	};

	View.onSelectTask = function(event) {
		this.router.navigate(
			'tasks/' + this.$(event.target).parent().data('task-id')
		);
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
		var self = this;
		// sync tasks which changed remotely
		this.collection.on('add', function(model) {
			model.on('change:title, change:status', function(model) {
				self.$(
					'#tasks-table-body tr[data-task-id=' + model.get('id') + ']'
				).replaceWith(
					self._render('tasks/tableRow', {task: model.toJSON()})
				);
			});
		});
		this.collection.on('backend:update', function(model) {
			this.get(model.id).set(model);
		});
	};

	View.onProjectChange = function() {
		this.renderVersions();
		this.$('#filter-version').change();
	};

	View.renderProjects = function(selected) {
		this.$('#filter-project').html(this._render('ctrls/opts', {
			placeholder: 'Any project',
			opts: this.collections.projects.map(function(project) {
				return project.get('name');
			}),
			selected: selected
		}));
	};

	View.renderVersions = function(selected) {
		var selProjectName = this.$('#filter-project').val(),
			selProject = this.collections.projects.find(function(project) {
				return project.get('name') === selProjectName;
			});
		this.$('#filter-version').html(this._render('ctrls/opts', {
			placeholder: 'Any version',
			opts: selProject ? selProject.get('versions') : [],
			selected: selected
		}));
	};

	View.renderAssignees = function(selected) {
		this.$('#filter-assignee').html(this._render('ctrls/opts', {
			placeholder: 'Any assignee',
			opts: this.collections.users.map(function(user) {
				return user.get('username');
			}),
			selected: selected
		}));
	};

	View.renderTableRows = function() {
		this.$('#tasks-table-body').html(this._render('tasks/tableRows', {
			tasks: this.collection.toJSON()
		}));
	};

	View.render = function(filters) {
		this.$el.html(this._render('tasks/index'));
		this.renderProjects(filters.project);
		this.renderVersions(filters.version);
		this.renderAssignees(filters.assignee);
		this.$('#filter-status').val(filters.status);
		this.onFilterChange();
	};

	return ParentView.extend(View);
});
