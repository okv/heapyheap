'use strict';

define(['app/collections/base'], function(ParentCollection) {
	var Collection = {
		backend: 'tasks'
	};

	return ParentCollection.extend(Collection);
});
