'use strict';

define(['backbone'], function(backbone, Task) {
	var Collection = {
		backend: 'tasks'
	};

	Collection.initialize = function() {
		//this.bindBackend();
	};

	return backbone.Collection.extend(Collection);
});
