'use strict';

define([
	'app/views/base', 'app/templates/tasks/item'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'click': 'onTaskClick'
	};

	View.onTaskClick = function(event) {
		this.navigate('tasks/' + this.$el.data('task-id'));
	};

	return ParentView.extend(View);
});
