'use strict';

/**
 * Module provides convenient way to render client-side templates,
 * template helpers also described here
 */

define([
	'underscore',
	//preload all templates
	'app/templates/login', 'app/templates/tasks/list',
	'app/templates/tasks/itemsList', 'app/templates/tasks/item',
	'app/templates/tasks/items',
	'app/templates/tasks/view', 'app/templates/ctrls/opts'
], function(
	_,
	login, tasksList, tasksItemsList, tasksItem, tasksItems,
	tasksView, ctrlsOpts
) {

	var template = {};

	template._hash = {
		login: login,
		'tasks/list': tasksList,
		'tasks/itemsList': tasksItemsList,
		'tasks/item': tasksItem,
		'tasks/items': tasksItems,
		'tasks/view': tasksView,
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
