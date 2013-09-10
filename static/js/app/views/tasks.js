'use strict';

define(['backbone'], function(backbone) {
	return function(router) {
		var View = {};

		View.render = function() {
			this.$el.html('Hi ' + router.user.login + ', this is tasks page');
		};

		return backbone.View.extend(View);
	}
});
