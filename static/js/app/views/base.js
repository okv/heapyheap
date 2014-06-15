'use strict';

define(['esencia/view', 'underscore'], function(ParentView, _) {

	var View = {};

	View.helpers = function() {
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
