'use strict';

define([
	'backbone', 'app/template', 'jquery'
], function(
	backbone, template, $
) {
	return function(router) {
		var View = {};

		View.initialize = function() {
			this.model.on('change:status', this.onModelChange, this);
		};

		View.onModelChange = function(model) {
			//TODO: pass to view only changed attributes
			this.render();
		};

		View.render = function() {
			this.$el.html(template.render('tasks/full', {
				task: this.model.toJSON()
			}));
		};

		var superOff =  backbone.View.prototype.off;
		View.off = function() {
			this.model.off('change:status', this.onModelChange, this);
			superOff.call(this);
		};

		return backbone.View.extend(View);
	};
});
