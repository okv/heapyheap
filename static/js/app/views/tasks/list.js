'use strict';

define([
	'app/views/base', 'underscore', 'app/templates/tasks/list',
	'app/views/components/select', 'app/views/tasks/item'
], function(
	ParentView, _, template,
	SelectView, TaskItemView
) {
	var View = {
		template: template
	};

	View.events = {
		'view:change #filter-project': 'onProjectChange',
		'view:change #filter-version,#filter-assignee,#filter-status': 'onFilterChange',
		'click #task-add': 'onAddTaskClick'
	};

	View.initialize = function() {
		var self = this;
		this.collection.each(function(model) {
			self.listenTo(model, 'change:title change:status', function(model) {
				this.setView(
					new TaskItemView(
						{data: {task: model.toJSON()}}
					),
					'#items',
					this.collection.indexOf(model)
				);
				this.render();
			});
		});
		// sync tasks which changed remotely
		this.listenTo(this.collection, 'backend:update', function(model) {
			var localModel = this.collection.get(model.id);
			if (localModel) localModel.set(model);
		});

		this.setFilterProjectView();
		this.setFilterVersionView();
		this.setFilterAssigneeView();
		this.setFilterStatusView();
		this.setTasks();
	};

	View.setFilterProjectView = function() {
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any project',
					opts: this.app.models.projects.pluck('name'),
					selected: this.data.filters.project
				}
			}),
			'#filter-project'
		);
	};

	View.setFilterVersionView = function() {
		var selProject = this.app.models.projects.findWhere({
			name: this.getView('#filter-project').getValue()
		});
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any version',
					opts: selProject ? selProject.get('versions') : [],
					selected: this.data.filters.version
				}
			}),
			'#filter-version'
		);
	};

	View.setFilterAssigneeView = function() {
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any assignee',
					opts: this.app.models.users.pluck('login'),
					selected: this.data.filters.assignee
				}
			}),
			'#filter-assignee'
		);
	};

	View.setFilterStatusView = function() {
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any status',
					opts: ['undone', 'waiting', 'in progress', 'done'],
					selected: this.data.filters.status
				}
			}),
			'#filter-status'
		);
	};

	View.setTasks = function() {
		this.setViews(this.collection.map(function(task) {
			return new TaskItemView({data: {task: task.toJSON()}});
		}), '#items');
	};

	View.getValues = function() {
		return {
			project: this.getView('#filter-project').getValue(),
			version: this.getView('#filter-version').getValue(),
			assignee: this.getView('#filter-assignee').getValue(),
			status: this.getView('#filter-status').getValue()
		};
	};

	View.onProjectChange = function(event) {
		this.setFilterVersionView();
		this.render();
		this.onFilterChange();
	};

	View.onFilterChange = function(event) {
		this.navigate('tasks', {qs: this.getValues()});
	};

	View.onAddTaskClick = function() {
		this.navigate('tasks/add', {qs: _(this.getValues()).omit('status')});
	};

	return ParentView.extend(View);
});
