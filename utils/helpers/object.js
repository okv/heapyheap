'use strict';

exports.extend = function(distanation, source) {
	for (var key in source) {
		distanation[key] = source[key];
	}
	return distanation;
};
