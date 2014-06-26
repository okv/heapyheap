'use strict';

define(['esencia/view', 'underscore'], function(ParentView, _) {

	var View = {};

	View.helpers = {};

	View.helpers.getQs = function(url) {
		url = url || window.location.href;
		return Backbone.History.prototype.getQueryParameters(url);
	};

	View.templateHelpers = function() {
		return {
			_: _,
			currentUser: this.app.currentUser
		};
	};

	View.navigate = function(fragment, options) {
		return this.app.router.navigate(fragment, options);
	};

	return ParentView.extend(View);
});