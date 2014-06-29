'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db');

exports.bind = function(backend) {
	backend.use('read', function(req, res, next) {
		var data = req.options.data || {};
		if (req.model.id) {
		} else {
			Steppy(
				function() {
					db.comments.find({start: data}, this.slot());
				},
				function(err, comments) {
					res.end(comments);
				},
				next
			);
		}
	});

	backend.use('create', function(req, res, next) {
		var comment = req.model;
		Steppy(
			function() {
				comment.author = req.user.login;
				comment.createDate = Date.now();
				db.comments.put(comment, this.slot());
			},
			function(err) {
				res.end(comment);
			},
			next
		);
	});

	return backend;
}
