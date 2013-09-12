'use strict';

define(['backbone', 'app/models/task'], function(backbone, Task) {
	var Collection = {
		backend: 'mybackend',
		model: Task
	};

	Collection.initialize = function() {
		//this.bindBackend();
	};

	return backbone.Collection.extend(Collection);
});
