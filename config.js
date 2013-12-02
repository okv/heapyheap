'use strict';

var configs = {};

configs.development = {
	listen: {
		host: '127.0.0.1',
		port: 3030
	},
	db: {path: './db'}
};

module.exports = function(name) {
	return configs[name || 'development'];
};
