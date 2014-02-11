'use strict';

define(['app/views/base'], function(ParentView) {
	var View = {};

	View.events = {
		'click #save': 'onSave'
	};

	View.onSave = function() {
		var self = this;
		this.model
			.set('title', this.$('#title').val())
			.set('assignee', this.$('#assignee').val())
			.save(null, {success: function(model) {
				self.navigate('tasks/' + model.get('id'))
			}});
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
	};

	View.render = function() {
		this.$el.html(this._render('tasks/form', {
			task: this.model.toJSON(),
			users: this.app.models.users.map(function(user) {
				return user.get('username');
			})
		}));
		return this;
	};

	return ParentView.extend(View);
});
