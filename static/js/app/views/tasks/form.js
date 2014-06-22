'use strict';

define([
	'app/views/base', 'app/templates/tasks/form',
	'app/views/components/taskParams'
], function(
	ParentView, template,
	TaskParamsView
) {
	var View = {
		template: template
	};

	View.events = {
		'click #save': 'onSaveClick'
	};

	View.initialize = function() {
		this.setView(
			new TaskParamsView({
				data: {
					selected: this.models.task.pick(
						'project', 'version', 'assignee'
					),
					fields: ['project', 'version', 'assignee']
				}
			}),
			'#params'
		);
	};

	View.onSaveClick = function() {
		var self = this;
		this.models.task
			.set({
				title: this.$('#title').val(),
				description: this.$('#description').val(),
			})
			.set(this.getView('#params').getValue())
			.save(null, {success: function(model) {
				self.navigate('tasks/' + model.get('id'))
			}});
	};

	View.getData = function() {
		return {task: this.models.task.toJSON()};
	};

	return ParentView.extend(View);
});
