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
		'view:change #filters': 'onFilterChange',
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

		this.setView(
			new TaskParamsView({data: {selected: this.data.filters}}),
			'#filters'
		);
		this.setViews(
			this.collection.map(function(task) {
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

	View.onAddTaskClick = function() {
		this.navigate('tasks/add', {qs: _(this.getValue()).omit('status')});
	};

	return ParentView.extend(View);
});
