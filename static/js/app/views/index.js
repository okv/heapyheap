'use strict';

define([
	'app/views/login', 'app/views/tasks'
], function(
	Login, Tasks
) {
	return {
		Login: Login,
		Tasks: Tasks
	};
});
