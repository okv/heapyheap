'use strict';

define(['backbone'], function(backbone) {
	var View = {};
	View.render = function() {
		this.$el.html('Hi, this is login page');
	};
	return backbone.View.extend(View);
});
