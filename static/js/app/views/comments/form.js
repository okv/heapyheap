'use strict';

define([
	'app/views/base', 'app/templates/comments/form'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'click .comment-send': 'onSendClick'
	};

	View.initialize = function() {
	};

	View.onSendClick = function() {
		var $text = $('.comment-text');
		this.models.comment.save({text: $text.val()});
	};

	View.getData = function() {
		return {comment: this.models.comment.toJSON()};
	};

	return ParentView.extend(View);
});
