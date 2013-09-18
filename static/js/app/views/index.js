'use strict';

define([
	'app/views/login', 'app/views/tasks', 'app/views/task'
], function(
	Login, Tasks, Task
) {
	return {
		Login: Login,
		Tasks: Tasks,
		Task: Task
	};
});
