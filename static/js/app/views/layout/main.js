'use strict';

define(['app/views/base'], function(ParentView) {
	var View = {};

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

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
	};

	View.render = function() {
		this.$el.html(this._render('layout/main'));
		return this;
	};

	return ParentView.extend(View);
});
