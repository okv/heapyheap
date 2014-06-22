'use strict';

define(['app/collections/base'], function(ParentCollection) {
	var Collection = {
		backend: 'projects'
	};

	return ParentCollection.extend(Collection);
});
