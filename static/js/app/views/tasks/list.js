'use strict';

define([
	'app/views/base', 'underscore', 'app/templates/tasks/list',
	'app/views/components/taskParams', 'app/views/tasks/item'
], function(
	ParentView, _, template,
	TaskParamsView, TaskItemView
) {
	var View = {
		template: template
	};

	View.events = {
		'view:change #filters': 'onFilterChange'
	};

	View.initialize = function() {
		var self = this;
		this.collections.tasks.each(function(model) {
			self.listenTo(model, 'change:title change:status', function(model) {
				this.setView(
					new TaskItemView({data: {task: model.toJSON()}}),
					'#items',
					this.collections.tasks.indexOf(model)
				);
				this.render();
			});
		});
		// sync tasks which changed remotely
		this.listenTo(this.collections.tasks, 'backend:update', function(model) {
			var localModel = this.collections.tasks.get(model.id);
			if (localModel) localModel.set(model);
		});

		this.setView(
			new TaskParamsView({data: {selected: this.data.filters}}),
			'#filters'
		);
		this.setViews(
			this.collections.tasks.map(function(task) {
				return new TaskItemView({data: {task: task.toJSON()}});
			}),
			'#items'
		);
	};

	View.getValue = function() {
		return this.getView('#filters').getValue();
	};

	View.onFilterChange = function(event) {
		this.navigate('tasks', {qs: this.getValue()});
	};

	return ParentView.extend(View);
});
