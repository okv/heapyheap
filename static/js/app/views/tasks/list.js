'use strict';

define(['app/views/base', 'underscore'], function(ParentView, _) {
	var View = {};

	View.events = {
		'change #filter-project': 'onProjectChange',
		'change #filter-version,#filter-assignee,#filter-status': 'onFilterChange',
		'click #tasks-table-body .tasks__item': 'onSelectTask',
		'click #task-add': 'onAddTask'
	};

	View.getValues = function() {
		return {
			project: this.$('#filter-project').val(),
			version: this.$('#filter-version').val(),
			assignee: this.$('#filter-assignee').val(),
			status: this.$('#filter-status').val()
		};
	};

	View.onFilterChange = function(event) {
		this.navigate('tasks', {qs: this.getValues()});
	};

	View.onSelectTask = function(event) {
		this.navigate('tasks/' + this.$(event.currentTarget).data('task-id'));
	};

	View.onAddTask = function() {
		this.navigate('tasks/add', {qs: _(this.getValues()).omit('status')});
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
		var self = this;
		this.collection.each(function(model) {
			self.listenTo(model, 'change:title change:status', function(model) {
				this.$(
					'#tasks-table-body [data-task-id=' + model.get('id') + ']'
				).replaceWith(
					this._render('tasks/item', {task: model.toJSON()})
				);
			});
		});
		// sync tasks which changed remotely
		this.listenTo(this.collection, 'backend:update', function(model) {
			var localModel = this.collection.get(model.id);
			if (localModel) localModel.set(model);
		});
	};

	View.onProjectChange = function() {
		this.renderVersions();
		this.$('#filter-version').change();
	};

	View.renderProjects = function(selected) {
		this.$('#filter-project').html(this._render('ctrls/opts', {
			placeholder: 'Any project',
			opts: this.app.models.projects.pluck('name'),
			selected: selected,
			callAtOnce: true
		}));
	};

	View.renderVersions = function(selected) {
		var selProject = this.app.models.projects.findWhere({
			name: this.$('#filter-project').val()
		});
		this.$('#filter-version').html(this._render('ctrls/opts', {
			placeholder: 'Any version',
			opts: selProject ? selProject.get('versions') : [],
			selected: selected,
			callAtOnce: true
		}));
	};

	View.renderAssignees = function(selected) {
		this.$('#filter-assignee').html(this._render('ctrls/opts', {
			placeholder: 'Any assignee',
			opts: this.app.models.users.pluck('username'),
			selected: selected,
			callAtOnce: true
		}));
	};

	View.renderTableRows = function() {
		this.$('#tasks-table-body').html(this._render('tasks/items', {
			tasks: this.collection.toJSON()
		}));
	};

	View.render = function(filters) {
		this.$el.html(this._render('tasks/list'));
		this.renderProjects(filters.project);
		this.renderVersions(filters.version);
		this.renderAssignees(filters.assignee);
		this.$('#filter-status').val(filters.status);
		this.renderTableRows();
		return this;
	};

	return ParentView.extend(View);
});
