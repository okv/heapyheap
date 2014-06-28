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
		'click .comment-send': 'onSendClick',
		'keyup .comment-text': 'onTextKeyup'
	};

	View.focus = function() {
		$('.comment-text').focus();
	};

	View.onSendClick = function() {
		var $text = $('.comment-text');
		this.models.comment.save({text: $text.val()});
	};

	View.onTextKeyup = function(event) {
		var $sendButton = $('.comment-send');
		$sendButton.prop('disabled', !$(event.currentTarget).val().length);
		if (event.ctrlKey && event.keyCode == 13) $sendButton.click();
	};

	View.getData = function() {
		return {comment: this.models.comment.toJSON()};
	};

	return ParentView.extend(View);
});
