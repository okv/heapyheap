'use strict';

var nlevel = require('nlevel'),
	config = require('./config')(),
	ldb = nlevel.db(config.db.path, {valueEncoding: 'json'});

exports.tasks = new nlevel.DocsSection(ldb, 'tasks', {
	projections: [
		// fullVersion - e.g. 2do2go 4.0.1
		{key: {fullVersion: 1, assignee: 1, status: 1, id: 1}, value: pickId},
		{key: {fullVersion: 1, status: 1, id: 1}, value: pickId},
		{key: {assignee: 1, status: 1, id: 1}, value: pickId},
		{key: {status: 1, id: 1}, value: pickId},
		{id: 'listInfo', key: {id: 1}, value: function(task) {
			return {id: task.id, title: task.title, status: task.status};
		}}
	]
});

function pickId(doc) {
	return {id: doc.id};
}

exports.projects = new nlevel.ValSection(ldb, 'projects');
