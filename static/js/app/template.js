'use strict';

/**
 * Module provides convenient way to render client-side templates,
 * template helpers also described here
 */

define([
	'underscore',
	//preload all templates
	'app/templates/login', 'app/templates/layout/main',
	'app/templates/tasks/list', 'app/templates/tasks/itemsList',
	'app/templates/tasks/item', 'app/templates/tasks/items',
	'app/templates/tasks/view', 'app/templates/tasks/form',
	'app/templates/users/list',
	'app/templates/ctrls/opts'
], function(
	_,
	login, layoutMain,
	tasksList, tasksItemsList,
	tasksItem, tasksItems,
	tasksView, tasksForm,
	usersList,
	ctrlsOpts
) {

	var template = {};

	template._hash = {
		login: login,
		'layout/main': layoutMain,
		'tasks/list': tasksList,
		'tasks/itemsList': tasksItemsList,
		'tasks/item': tasksItem,
		'tasks/items': tasksItems,
		'tasks/view': tasksView,
		'tasks/form': tasksForm,
		'users/list': usersList,
		'ctrls/opts': ctrlsOpts
	};

	template.helpers = {};
	template.helpers._ = _;

	template.render = function(templateName, params) {
		if (templateName in this._hash === false) {
			throw new Error('Template is not found: ' + templateName);
		}
		return this._hash[templateName](_(params || {}).extend(template.helpers));
	};

	return template;
});
