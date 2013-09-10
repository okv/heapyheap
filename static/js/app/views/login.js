'use strict';

define([
	'backbone', 'app/template'
], function(
	backbone, template
) {
	return function(router) {
		var View = {};

		View.events = {
			'click #login-button': 'login'
		};

		View.login = function() {
			var self = this;
			router.service.login(
				this.$('#login').val(),
				this.$('#password').val(),
				function(user) {
					if (user.login) {
						router.navigate('tasks', {trigger: true});
					}
				}
			);
		};

		View.render = function() {
			this.$el.html(template.render('login'));
		};

		return backbone.View.extend(View);
};
});
