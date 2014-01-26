'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db');

exports.bind = function(backend) {
	backend.use('read', function(req, res, next) {
		if (req.model.id) {
			console.log('>>> getting single: ', req.model.id);
		} else {
			console.log('>>> getting list: ', req.options.data);
			Steppy(
				function() {
					db.users.get(this.slot());
				},
				function(err, users) {
					res.end(users);
				},
				next
			);
		}
	});

	return backend;
}
