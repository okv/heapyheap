'use strict';

define([
	'underscore', 'app/views/base', 'app/templates/layout/main'
], function(
	_, ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'click .nav a': 'onNaviClick',
		'click #logout-link': 'onLogoutClick',
		'click #task-add': 'onAddTaskClick'
	};

	View.onNaviClick = function(event) {
		event.preventDefault();
		this.navigate(this.$(event.currentTarget).attr('href'));
	};

	View.onLogoutClick = function(event) {
		event.preventDefault();
		this.app.logout();
	};

	View.onAddTaskClick = function() {
		this.navigate('tasks/add', {
			qs: _(this.helpers.getQs()).pick('project', 'version', 'assignee')
		});
	};

	return ParentView.extend(View);
});
