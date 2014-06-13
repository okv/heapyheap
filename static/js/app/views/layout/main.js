'use strict';

define([
	'app/views/base', 'app/templates/layout/main'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'click .navi a': 'onNaviClick',
		'click #logout-link': 'onLogoutClick'
	};

	View.onNaviClick = function(event) {
		event.preventDefault();
		this.navigate(this.$(event.currentTarget).attr('href'));
	};

	View.onLogoutClick = function(event) {
		event.preventDefault();
		this.app.logout();
	};

	return ParentView.extend(View);
});
