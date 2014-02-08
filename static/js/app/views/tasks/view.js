'use strict';

define(['app/views/base'], function(ParentView) {
	var View = {};

	View.events = {
		'click #task-change-status': 'onTaskChangeStatusButtonClick'
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
		this.listenTo(this.model, 'change:status', this.onModelChange);
	};

	View.onTaskChangeStatusButtonClick = function() {
		this.model.set(
			'status',
			this.model.get('status') === 'waiting' ? 'in porgress' : 'waiting'
		);
		this.model.save();
	};

	View.onModelChange = function(model) {
		//TODO: pass to view only changed attributes
		this.render();
	};

	View.render = function() {
		this.$el.html(this._render('tasks/view', {
			task: this.model.toJSON()
		}));
		return this;
	};

	return ParentView.extend(View);
});
