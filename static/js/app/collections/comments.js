'use strict';

define(['app/collections/base'], function(ParentCollection) {
	var Collection = {
		backend: 'comments'
	};

	Collection.initialize = function() {
		this.bindBackend();
	};

	return ParentCollection.extend(Collection);
});
