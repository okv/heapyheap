'use strict';

var backboneio = require('backbone.io'),
	Steppy = require('twostep'),
	db = require('../db');

var backends = {
	tasks: require('./tasks'),
	projects: require('./projects'),
	users: require('./users')
};

for (var name in backends) {
	var backend = backboneio.createBackend();

	backend.use(function(req, res, next) {
		Steppy(
			function() {
				var token = req.options.token;
				if (!token) throw new Error('Request without token');
				db.tokens.get({id: token}, this.slot());
			},
			function(err, tokenData) {
				db.users.get({login: tokenData.user}, this.slot());
			},
			function(err, user) {
				req.user = user;

				var isRead = req.method === 'read',
					isList = Array.isArray(req.model);
				console.log(
					'\n-- [%s] %s %s by %s with params %s',
					new Date(), req.backend, req.method + (
						isRead ? (isList ? ' list' : ' one') : ''
					),
					user.login,
					JSON.stringify(isList ? req.options.data : req.model)
				);

				this.pass(null);
			},
			next
		);
	});

	backends[name].bind(backend);

	// export backends
	exports[name] = backend;

	// log backend errors
	backend.use(function(err, req, res, next) {
		if (err) console.log(err.stack || err);
	});
}
