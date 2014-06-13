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
					selected: this.model.pick('project', 'version', 'assignee'),
					fields: ['project', 'version', 'assignee']
				}
			}),
			'#params'
		);
	};

	View.onSaveClick = function() {
		var self = this;
		this.model
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
		return {task: this.model.toJSON()};
	};

	return ParentView.extend(View);
});
