'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db'),
	helpers = require('../utils/helpers'),
	marked = require('marked'),
	backends = require('./index');

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
					db.tasks.get({id: model.id}, this.slot());
				} else {
					this.pass(null);
					model.createDate = model.updateDate;
					model.status = 'waiting';
				}
			},
			function(err, prevTask) {
				this.pass(prevTask);
				model.descriptionHtml = createHtmlDescription(model.description);
				db.tasks.put(model, this.slot());
			},
			function(err, prevTask) {
				if (prevTask) {
					var text = '';
					['title', 'status'].forEach(function(field) {
						if (model[field] !== prevTask[field]) {
							text += 'Task ' + field + ' changed from "' +
								prevTask[field] + '" to "' + model[field] + '"\n';
						}
					});
					if (text) {
						var comment = {
							taskId: model.id,
							author: req.user.login,
							createDate: Date.now(),
							text: text
						};
						this.pass(comment);
						db.comments.put(comment, this.slot());
					}
				} else {
					this.pass(null);
				}
			},
			function(err, comment) {
				if (comment) backends.comments.emit('created', comment);
				res.end(model);
			},
			next
		);
	});

	marked.setOptions({
		highlight: function (code) {
			return require('highlight.js').highlightAuto(code).value;
		}
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
