'use strict';

exports.extend = function(distanation, source) {
	for (var key in source) {
		distanation[key] = source[key];
	}
	return distanation;
};

exports.omit = function(obj, keys) {
	keys = Array.isArray(keys) || Array.prototype.slice.call(arguments, 1);
	var result = {};
	Object.keys(obj).forEach(function(key) {
		if (keys.indexOf(key) === -1) result[key] = obj[key];
	});
	return result;
};

exports.remove = function(obj, keys) {
	keys = Array.isArray(keys) || Array.prototype.slice.call(arguments, 1);
	keys.forEach(function(key) {
		delete obj[key];
	});
	return obj;
};
