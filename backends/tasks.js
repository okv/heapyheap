'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db');

exports.bind = function(backend) {
	backend.use('read', function(req, res, next) {
		var data = req.options.data || {},
			id = req.model.id || data.id;
		if (id) {
			console.log('>>> getting single: ', id);
			db.tasks.get({id: id}, function(err, obj) {
				if (err) return next(err);
				console.log('>>> getting single: ', obj);
				res.end(obj);
			});
		} else {
			var filters = data,
				start = {},
				end = {};
			console.log('>>> getting list: ', filters);
			if (!filters.limit) filters.limit = 10;
			if (filters.project) start.project = filters.project;
			if (filters.version) start.version = filters.version;
			if (filters.assignee) start.assignee = filters.assignee;
			if (filters.status) {
				if (filters.status === 'undone') {
					start.status = 'in progress';
					end.status = 'waiting';
				} else {
					start.status = filters.status;
				}
			}
			console.log('>>> start = ', start, end)
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
