'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db'),
	helpers = require('../utils/helpers'),
	marked = require('marked');

exports.bind = function(backend) {
	backend.use('read', function(req, res, next) {
		var data = req.options.data || {},
			id = req.model.id || data.id;
		if (id) {
			db.tasks.get({id: id}, function(err, obj) {
				if (err) return next(err);
				res.end(obj);
			});
		} else {
			var filters = data,
				start = {};
			if (!filters.limit) filters.limit = 10;
			if (filters.project) start.project = filters.project;
			if (filters.version) start.version = filters.version;
			if (filters.assignee) start.assignee = filters.assignee;
			var end = helpers.extend({}, start);
			if (filters.status) {
				if (filters.status === 'undone') {
					start.status = 'in progress';
					end.status = 'waiting';
				} else {
					start.status = filters.status;
					end.status = filters.status;
				}
			}
			// always sor by `order`
			start.order = '';
			end.order = '';
			Steppy(
				function() {
					db.tasks.find({
						start: start,
						end: end,
						limit: filters.limit
					}, this.slot());
				},
				function(err, objs) {
					if (objs.length) {
						var group = this.makeGroup();
						objs.forEach(function(obj) {
							// should find by `listInfo` (when get will supports `by`)
							db.tasks.get({id: obj.id}, group.slot());
						});
					} else {
						this.pass(objs);
					}
				},
				function(err, objs) {
					res.end(objs);
				},
				next
			);
		}
	});

	backend.use('create', 'update', function(req, res, next) {
		var model = req.model;
		Steppy(
			function() {
				model.updateDate = Date.now();
				if (model.id) {
					this.pass(model.id);
				} else {
					model.createDate = model.updateDate;
					model.status = 'waiting';
					db.tasks.getNextId(this.slot());
				}
			},
			function(err, id) {
				model.id = id;
				model.descriptionHtml = createHtmlDescription(model.description);
				db.tasks.put(model, this.slot());
			},
			function(err) {
				res.end(model);
			},
			next
		);
	});

	var renderer = new marked.Renderer(),
		checkRegExp = /^ *\[([ vx])\]/,
		checkedHash = {'v': 1, 'x': 1};
	renderer.listitem = function(text, isOrdered) {
		var parts = checkRegExp.exec(text);
		if (parts && parts[1]) {
			text = text.replace(checkRegExp, '');
			text = (
				'<input ' + (checkedHash[parts[1]] ? 'checked="checked"' : '') +
				' type="checkbox"/>' + text
			);
		}
		return '<li>' + text + '</li>\n';
	};

	var tagRegExp = /\w+/;
	var superHeading = renderer.heading;
	renderer.heading = function(text, level) {
		if (level === 1 && tagRegExp.test(text)) {
			return '#' + text;
		} else {
			return superHeading.apply(this, arguments);
		}
	};

	function createHtmlDescription(description) {
		return marked(description, {renderer: renderer});
	}

	return backend;
}
