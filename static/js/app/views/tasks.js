'use strict';

define(['backbone'], function(backbone) {
	var View = {};
	View.render = function() {
		this.$el.html('Hi, this is tasks page');
	};
	return backbone.View.extend(View);
});
