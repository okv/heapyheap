'use strict';

define(['backbone'], function(backbone) {
	var Collection = {
		backend: 'users'
	};

	return backbone.Collection.extend(Collection);
});
