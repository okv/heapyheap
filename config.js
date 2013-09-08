'use strict';

var configs = {};

configs.development = {
	listen: {
		host: '127.0.0.1',
		port: 3030
	}
};

module.exports = function(name) {
	if (name in configs === false) throw new Error(
		'Unknown config: ' + name
	);
	return configs[name];
};
