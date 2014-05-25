'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db');

exports.bind = function(backend) {
	backend.use('read', function(req, res, next) {
		if (req.model.id) {
		} else {
			Steppy(
				function() {
					db.projects.get(this.slot());
				},
				function(err, projects) {
					res.end(projects);
				},
				next
			);
		}
	});

	return backend;
}
