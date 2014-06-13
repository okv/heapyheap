'use strict';

define([
	'app/views/base', 'underscore', 'app/templates/components/taskParams',
	'app/views/components/select', 'app/views/tasks/item'
], function(
	ParentView, _, template,
	SelectView, TaskItemView
) {
	var View = {
		template: template
	};

	View.events = {
		'view:change .project': 'onProjectChange',
		'view:change .version, .assignee, .status': 'onChange'
	};

	View.initialize = function() {
		this.data.fields = this.data.fields || [
			'project', 'version', 'assignee', 'status'
		];
		var fields = this.data.fields;
		if (_(fields).contains('project')) this.setProjectView();
		if (_(fields).contains('version')) this.setVersionView();
		if (_(fields).contains('assignee')) this.setAssigneeView();
		if (_(fields).contains('status')) this.setStatusView();
	};

	View.getData = function() {
		return {fields: this.data.fields}
	};

	View.setProjectView = function() {
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any project',
					opts: this.app.models.projects.pluck('name'),
					selected: this.data.selected.project
				}
			}),
			'.project'
		);
	};

	View.setVersionView = function() {
		var selProject = this.app.models.projects.findWhere({
			name: this.getView('.project').getValue()
		});
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any version',
					opts: selProject ? selProject.get('versions') : [],
					selected: this.data.selected.version
				}
			}),
			'.version'
		);
	};

	View.setAssigneeView = function() {
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any assignee',
					opts: this.app.models.users.pluck('login'),
					selected: this.data.selected.assignee
				}
			}),
			'.assignee'
		);
	};

	View.setStatusView = function() {
		this.setView(
			new SelectView({
				data: {
					placeholder: 'Any status',
					opts: ['undone', 'waiting', 'in progress', 'done'],
					selected: this.data.selected.status
				}
			}),
			'.status'
		);
	};

	View.getValue = function() {
		return _({
			project: this.getView('.project') && this.getView('.project').getValue(),
			version: this.getView('.version') && this.getView('.version').getValue(),
			assignee: this.getView('.assignee') && this.getView('.assignee').getValue(),
			status: this.getView('.status') && this.getView('.status').getValue()
		}).pick(this.data.fields);
	};

	View.onProjectChange = function(event) {
		this.setVersionView();
		this.render();
		this.onChange();
	};

	View.onChange = function(event) {
		this.trigger('change', this.getValue());
	};

	return ParentView.extend(View);
});
