'use strict';

define([
	'backbone', 'app/template', 'jquery'
], function(
	backbone, template, $
) {
	return function(router) {
		var View = {};

		View.initialize = function() {
			var self = this,
				model = this.model;
			model.on('change:status', this.onModelChange, this);
		};

		View.onModelChange = function(model) {
			//TODO: pass to view only changed attributes
			this.$el.html(template.render('tasks/full', {task: model.toJSON()}));
		};

		View.render = function() {
			var self = this,
				model = this.model;
			model.once('sync', function(model) {
				self.$el.html(template.render('tasks/full', {
					task: model.toJSON()
				}));
			});
			model.fetch({data: {detailed: true}});
		};

		var superUnbind =  backbone.View.prototype.unbind;
		View.unbind = function() {
			this.model.off('change:status', this.onModelChange, this);
			superUnbind.call(this);
		};

		return backbone.View.extend(View);
	};
});
