'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db');

exports.bind = function(backend) {
	backend.use('read', function(req, res, next) {
		if (req.model.id) {
			console.log('>>> getting single: ', req.model.id);
			var detailed = req.options.data && req.options.data.detailed;
			if (detailed) db.tasks.get({id: req.model.id}, function(err, obj) {
				if (err) return next(err);
				res.end(obj);
			});
		} else {
			var filters = req.options.data,
				start = {},
				end = {};
			console.log('>>> getting list: ', filters);
			if (filters.project) start.fullVersion = filters.project;
			if (filters.version && start.fullVersion) {
				start.fullVersion += ' ' + filters.version;
			}
			if (filters.status) {
				if (filters.status === 'undone') {
					start.status = 'in progress';
					end.status = 'waiting';
				} else {
					start.status = filters.status;
				}
			}
			Steppy(
				function() {
					db.tasks.find({
						start: start,
						end: end,
						limit: filters.limit
					}, this.slot());
				},
				function(err, objs) {
					var group = this.makeGroup();
					objs.forEach(function(obj) {
						// should find by `listInfo` (when get will supports `by`)
						db.tasks.get({id: obj.id}, group.slot());
					});
				},
				function(err, objs) {
					console.log('>>> obj = ', objs[0])
					res.end(objs);
				},
				next
			);
		}
	});

	backend.use('update', function(req, res, next) {
		db.tasks.put(req.model, function(err) {
			if (err) return next(err);
			res.end(req.model);
		});
	});

	return backend;
}
