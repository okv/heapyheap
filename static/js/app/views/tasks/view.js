'use strict';

define([
	'app/views/base', 'app/templates/tasks/view'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'click #task-change-status': 'onChangeStatusClick',
		'click #task-change-timer': 'onChangeTimerClick',
		'click #task-edit': 'onEditClick'
	};

	View.initialize = function() {
		this.listenTo(this.models.task, 'change:status', this.onModelChange);
	};

	View.onChangeTimerClick = function() {
		console.log('timer click');
	};

	View.onChangeStatusClick = function() {
		this.models.task.set(
			'status',
			this.models.task.get('status') === 'waiting' ? 'in porgress' : 'waiting'
		);
		this.models.task.save();
	};

	View.onEditClick = function() {
		this.navigate('tasks/' + this.models.task.get('id') + '/edit');
	};

	View.onModelChange = function(model) {
		this.render({force: true});
	};

	View.getData = function() {
		return {task: this.models.task.toJSON()};
	};

	return ParentView.extend(View);
});
