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
		'click [data-action=navigate]': 'onNavClick',
		'click #logout-link': 'onLogoutClick',
		'click #task-add': 'onAddTaskClick'
	};

	View.onNavClick = function(event) {
		event.preventDefault();
		var $nav = this.$(event.currentTarget);
		this.navigate($nav.attr('href') || $nav.data('href'));
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
