'use strict';

define(['app/collections/base'], function(ParentCollection) {
	var Collection = {
		backend: 'users'
	};

	return ParentCollection.extend(Collection);
});
