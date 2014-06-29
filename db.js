'use strict';

var nlevel = require('nlevel'),
	config = require('./config')(),
	ldb = nlevel.db(config.db.path, {valueEncoding: 'json'}),
	helpers = require('./utils/helpers');


exports.tasks = new nlevel.DocsSection(ldb, 'tasks', {
	projections: [
		{key: {createDate: 1}},
		// some combinations with `order` goes first for sort by
		// reversed update date when some parameters are not set
		{key: {project: 1, order: order, id: 1}, value: pickId},
		{key: {project: 1, version: 1, order: order, id: 1}, value: pickId},
		{key: {project: 1, version: 1, assignee: 1, order: order, id: 1}, value: pickId},
		{key: {project: 1, assignee: 1, order: order, id: 1}, value: pickId},
		{key: {assignee: 1, order: order, id: 1}, value: pickId},
		{key: {order: order, id: 1}, value: pickId},
		// always have `order` before `id` to sort by reversed update date
		{key: {project: 1, version: 1, assignee: 1, status: 1, order: order, id: 1}, value: pickId},
		{key: {project: 1, assignee: 1, status: 1, order: order, id: 1}, value: pickId},
		{key: {project: 1, status: 1, order: order, id: 1}, value: pickId},
		{key: {project: 1, version: 1, status: 1, order: order, id: 1}, value: pickId},
		{key: {assignee: 1, status: 1, order: order, id: 1}, value: pickId},
		{key: {status: 1, order: order, id: 1}, value: pickId},
		{id: 'listInfo', key: {id: 1}, value: function(task) {
			return {id: task.id, title: task.title, status: task.status};
		}}
	]
});

exports.tasks.idGenerator = getNextId;

// TODO: move to nlevel
var superPut = nlevel.DocsSection.prototype.put;
nlevel.DocsSection.prototype.put = function(docs, callback) {
	var self = this;
	if (!Array.isArray(docs)) docs = [docs];
	if (this.idGenerator && docs[0] && 'id' in docs[0] === false) {
		if (docs.every(function(doc) { return 'id' in doc === false; })) {
			this.idGenerator(function(err, id) {
				if (err) return callback(err);
				docs.forEach(function(doc) {
					doc.id = id;
					id++;
				});
				superPut.call(self, docs, callback);
			});
		} else {
			return callback(new Error(
				'Documents with id and without should not be ' +
				'mixed on put when id generator is set'
			));
		}
	} else {
		return superPut.call(this, docs, callback);
	}
};

function getNextId(callback) {
	// TODO: check default start and how `by` is working
	this.find({start: {createDate: ''}, limit: 1, reverse: true}, function(err, docs) {
		callback(err, !err && docs[0] && ++docs[0].id || 1);
	});
}

function pickId(doc) {
	return {id: doc.id};
}

// reversed update date - for sorting forward (it's fatster for leveldb then
// reverse: true, see levelup reverse notes for details) but have documents
// sorted by update date in descending order
// TODO: maybe use reverse: true coz too many projections needed for current hack
var maxTime = new Date('03:14:07 UTC 2138-01-19').getTime();
function order(doc) {
	return maxTime - doc.updateDate;
}

exports.projects = new nlevel.ValSection(ldb, 'projects');

// `password` should be omitted for all projections due security reasons
// `id` projection should not be used coz password can't be omitted for it
// (`login` projection should be used instead)
exports.users = new nlevel.DocsSection(ldb, 'users', {
	projections: [
		{key: {login: 1}, value: omitPassword},
		{key: {login: 1, password: 1}, value: omitPassword}
	]
});

function omitPassword(doc) {
	return helpers.omit(doc, 'password');
}

exports.tokens = new nlevel.DocsSection(ldb, 'tokens', {});

exports.comments = new nlevel.DocsSection(ldb, 'comments', {
	projections: [
		{key: {createDate: 1}},
		{key: {taskId: 1, createDate: 1}}
	]
});
exports.comments.idGenerator = getNextId;
