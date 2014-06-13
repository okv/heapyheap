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
		'click #task-edit': 'onEditClick'
	};

	View.initialize = function() {
		this.listenTo(this.model, 'change:status', this.onModelChange);
	};

	View.onChangeStatusClick = function() {
		this.model.set(
			'status',
			this.model.get('status') === 'waiting' ? 'in porgress' : 'waiting'
		);
		this.model.save();
	};

	View.onEditClick = function() {
		this.navigate('tasks/' + this.model.get('id') + '/edit');
	};

	View.onModelChange = function(model) {
		this.render({force: true});
	};

	View.getData = function() {
		return {task: this.model.toJSON()};
	};

	return ParentView.extend(View);
});
