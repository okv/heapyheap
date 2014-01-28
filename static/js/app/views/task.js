'use strict';

define([
	'backbone', 'app/template', 'jquery'
], function(
	backbone, template, $
) {
	return function(router) {
		var View = {};

		View.events = {
			'click #task-change-status': 'onTaskChangeStatusButtonClick'
		};

		View.initialize = function() {
			this.model.on('change:status', this.onModelChange, this);
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
			this.$el.html(template.render('tasks/full', {
				task: this.model.toJSON()
			}));
			return this;
		};

		var superOff =  backbone.View.prototype.off;
		View.off = function() {
			// TODO: add base with default `off` ($el.off())
			this.$el.off();
			this.model.off('change:status', this.onModelChange, this);
			superOff.call(this);
		};

		return backbone.View.extend(View);
	};
});
