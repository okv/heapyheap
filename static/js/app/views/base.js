'use strict';

define(['esencia/view'], function(ParentView) {

	var View = {};

	View.getHelpers = function() {
		return {
			currentUser: this.app.currentUser
		};
	};

	View.navigate = function(fragment, options) {
		return this.app.router.navigate(fragment, options);
	};

	return ParentView.extend(View);
});
