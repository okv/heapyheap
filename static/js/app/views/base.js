'use strict';

define(['backbone', 'app/template'], function(backbone, template) {
	var ParentView = backbone.View;

	var View = {};

	View.initialize = function() {
		this.attach();
	};

	View._render = function(templateName, params) {
		params = params || {};
		params.currentUser = this.app.currentUser;
		return template.render(templateName, params);
	};

	View.isRendered = function() {
		return this.$el && this.$el.data('view') && this.$el.data('view') === this;
	};

	View.navigate = function(fragment, options) {
		return this.app.router.navigate(fragment, options);
	};

	View.attach = function() {
		// detach previous instance attached to this element
		var view = this.$el.data('view');
		if (view) view.detach();
		// detach all nested views
		this.$el.parent().find('.view-attached').each(function(index, el) {
			var view = $(el).data('view');
			if (view) view.detach();
		});
		// then attach current
		this.$el.data('view', this);
		this.$el.addClass('view-attached');
	};

	View.detach = function() {
		this.$el.removeClass('view-attached');
		this.undelegateEvents();
		this.stopListening();
		return this;
	};

	return backbone.View.extend(View);
});
