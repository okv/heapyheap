'use strict';

define([
	'backbone', 'underscore', 'esencia/view'
], function(
	backbone, _, ParentView
) {

	var View = {};

	View.helpers = {};

	View.helpers.getQs = function(url) {
		url = url || window.location.href;
		return backbone.History.prototype.getQueryParameters(url);
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