'use strict';

define([
	'app/views/base', 'app/templates/tasks/view',
	'app/views/comments/view', 'app/views/comments/form'
], function(
	ParentView, template,
	CommentView, CommentFormView
) {
	var View = {
		template: template
	};

	View.events = {
		'click #task-change-status': 'onChangeStatusClick',
		'click #task-edit': 'onEditClick'
	};

	View.initialize = function() {
		this.listenTo(this.models.task, 'change:status', this.onModelChange);
		this.setComments();
		this.setCommentsForm();
		this.listenTo(this.collections.comments, 'add', function(model) {
			this.appendView(
				new CommentView({models: {comment: model}}),
				'#comments'
			);
			this.render();
		});
	};

	View.setComments = function() {
		this.setViews(this.collections.comments.map(function(comment) {
			return new CommentView({models: {comment: comment}});
		}), '#comments');
	};

	View.setCommentsForm = function() {
		var comment = this.collections.comments.create({
			taskId: this.models.task.get('id')
		}, {local: true});
		this.setView(
			new CommentFormView({models: {comment: comment}}),
			'#comment-form'
		);
		this.listenTo(comment, 'sync', function(model) {
			this.appendView(new CommentView({models: {comment: model}}), '#comments');
			this.stopListening(comment);
			this.setCommentsForm();
			this.render();
		});
	};

	View.onChangeStatusClick = function() {
		this.models.task.set(
			'status',
			this.models.task.get('status') === 'waiting' ? 'in porgress' : 'waiting'
		);
		this.models.task.save();
	};

	View.onEditClick = function() {
		this.navigate('tasks/' + this.models.task.get('id') + '/edit');
	};

	View.onModelChange = function(model) {
		this.render({force: true});
	};

	View.getData = function() {
		return {task: this.models.task.toJSON()};
	};

	return ParentView.extend(View);
});
