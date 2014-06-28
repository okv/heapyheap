'use strict';

define([
	'app/views/base', 'app/templates/comments/view'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
	};

	View.initialize = function() {
	};

	View.getData = function() {
		return {comment: this.models.comment.toJSON()};
	};

	return ParentView.extend(View);
});
