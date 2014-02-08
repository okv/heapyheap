'use strict';

define(['app/views/base'], function(ParentView) {
	var View = {};

	View.events = {
		'click #login-button': 'login'
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
	};

	View.login = function() {
		var self = this;
		self.app.service.login(
			self.$('#login').val(),
			self.$('#password').val(),
			function(user) {
				if (user.login) {
					console.log('retrived user: ', user)
					self.app.user = user;
					// navigate to `returnUrl` or default route
					self.navigate(self.app.returnUrl || self.app.defaultRoute);
					delete self.app.returnUrl;
				}
			}
		);
	};

	View.render = function() {
		this.$el.html(this._render('login'));
		// dev autologin
		this.$('#login').val('spike');
		this.$('#password').val('gkpod');
		this.$('#login-button').click();
	};

	return ParentView.extend(View);
});
