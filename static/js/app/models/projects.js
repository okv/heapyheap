'use strict';

define(['backbone'], function(backbone, Task) {
	var Collection = {
		backend: 'projects'
	};

	return backbone.Collection.extend(Collection);
});
