'use strict';

define(['backbone', 'app/template'], function(backbone, template) {
	var ParentView = backbone.View;

	var View = {};

	View.initialize = function() {
	};

	View._render = function(templateName, params) {
		return template.render(templateName, params);
	};

	View.navigate = function(fragment, options) {
		return this.router.navigate(fragment, options);
	};

	View.detach = function() {
		this.undelegateEvents();
		this.stopListening();
		return this;
	};

	return backbone.View.extend(View);
});
