'use strict';

var nlevel = require('nlevel'),
	config = require('./config')(),
	ldb = nlevel.db(config.db.path, {valueEncoding: 'json'});

exports.tasks = new nlevel.DocsSection(ldb, 'tasks', {
	projections: [
		// some combinations with `id` goes first for sort by id when some
		// parameterss are not set
		{key: {project: 1, id: 1}, value: pickId},
		{key: {project: 1, version: 1, id: 1}, value: pickId},
		{key: {project: 1, version: 1, assignee: 1, id: 1}, value: pickId},
		{key: {project: 1, assignee: 1, id: 1}, value: pickId},

		{key: {project: 1, version: 1, assignee: 1, status: 1, id: 1}, value: pickId},
		{key: {project: 1, assignee: 1, status: 1, id: 1}, value: pickId},
		{key: {project: 1, status: 1, id: 1}, value: pickId},
		{key: {project: 1, version: 1, status: 1, id: 1}, value: pickId},
		{key: {assignee: 1, status: 1, id: 1}, value: pickId},
		{key: {status: 1, id: 1}, value: pickId},
		{id: 'listInfo', key: {id: 1}, value: function(task) {
			return {id: task.id, title: task.title, status: task.status};
		}}
	]
});

exports.tasks.getNextId = getNextId;

function getNextId(callback) {
	this.find({by: 'id', limit: 1, reverse: true}, function(err, docs) {
		callback(err, !err && ++docs[0].id);
	});
}

function pickId(doc) {
	return {id: doc.id};
}

exports.projects = new nlevel.ValSection(ldb, 'projects');
exports.users = new nlevel.ValSection(ldb, 'users');
