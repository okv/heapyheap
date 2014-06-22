'use strict';

define(['backbone'], function(backbone) {
	var ParentCollection = backbone.Collection;

	var Collection = {
	};

	var superCreate = ParentCollection.prototype.create;
	Collection.create = function(attributes, options) {
		if (options && options.local) {
			var model = new this.model(attributes);
			return this._prepareModel(model);
		} else {
			return superCreate.apply(this, arguments);
		}
	};

	var superFetch = ParentCollection.prototype.fetch;
	Collection.fetch = function(options) {
		options = options || {};
		// reset collection by default coz client merge breaks server sorting
		options.reset = 'reset' in options ? options.reset : true;
		superFetch.call(this, options);
	};

	return ParentCollection.extend(Collection);
});
