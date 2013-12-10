'use strict';

/**
 * Module provides convenient way to render client-side templates,
 * template helpers also described here
 */

define([
	'underscore',
	//preload all templates
	'app/templates/login', 'app/templates/tasks/index',
	'app/templates/tasks/table', 'app/templates/tasks/tableRow',
	'app/templates/tasks/full', 'app/templates/ctrls/opts'
], function(
	_,
	login, tasks, tasksTable, tasksTableRow,
	tasksFull, ctrlsOpts
) {

	var template = {};

	template._hash = {
		login: login,
		tasks: tasks,
		'tasks/table': tasksTable,
		'tasks/tableRow': tasksTableRow,
		'tasks/full': tasksFull,
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
