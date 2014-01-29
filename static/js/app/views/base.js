'use strict';

define(['backbone', 'app/template'], function(backbone, template) {
	var ParentView = backbone.View;

	var View = {};

	View.initialize = function() {
		console.log('>>> base view initialize')
	};

	View._render = function(templateName, params) {
		return template.render(templateName, params);
	};

	var parentOff =  ParentView.prototype.off;
	View.off = function() {
		this.$el.off();
		parentOff.call(this);
	};

	return backbone.View.extend(View);
});
