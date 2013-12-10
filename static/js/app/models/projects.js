'use strict';

define(['backbone', 'app/models/task'], function(backbone, Task) {
	var Collection = {
		backend: 'projects'
	};

	return backbone.Collection.extend(Collection);
});
