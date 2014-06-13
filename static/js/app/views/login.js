'use strict';

define([
	'app/views/base', 'app/templates/login'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'click #login-button': 'onLoginButtonClick'
	};

	View.onLoginButtonClick = function() {
		var self = this;
		self.app.service.login(
			self.$('#login').val(),
			self.$('#password').val(),
			function(err, data) {
				if (err) {
					self.$('.errors').text(err.userMessage || 'Some login error');
				} else {
					console.log('retrived login data: ', data)
					self.app.login(data);
					// navigate to `returnUrl` or default route
					self.navigate(self.app.returnUrl || self.app.defaultRoute);
					delete self.app.returnUrl;
				}
			}
		);
	};

	return ParentView.extend(View);
});
