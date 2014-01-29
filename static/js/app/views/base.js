'use strict';

define(['backbone', 'app/template'], function(backbone, template) {
	var ParentView = backbone.View;

	var View = {};

	View.initialize = function() {
		// detach previous instance attached to this element, then attach current
		// TODO; think about detach all views of children dom elements
		var view = this.$el.data('view');
		if (view) view.detach();
		this.$el.data('view', this);
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
