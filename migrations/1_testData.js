'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db'),
	zlib = require('zlib'),
	fs = require('fs'),
	path = require('path'),
	createPassword = require('../utils/helpers/user').createPassword;


exports.migrate = function(client, done) {
	var statusesHash = {New: 'waiting', Resolved: 'done'};

	var usersHash = {},
		projectsHash = {};

	Steppy(
		function() {
			fs.readFile(path.resolve('.', 'dev', 'issues.json.gz'), this.slot());
		},
		function(err, data) {
			zlib.gunzip(data, this.slot());
		},
		function(err, buffer) {
			var issues = JSON.parse(buffer.toString());
			var tasks = issues.map(function(issue) {
				var assignee = issue.assigned_to && issue.assigned_to.name;
				var task = {
					id: issue.id,
					createDate: new Date(issue.created_on).getTime(),
					updateDate: new Date(issue.updated_on).getTime(),
					title: issue.subject,
					description: issue.description,
					descriptionHtml: issue.description,
					version: issue.fixed_version && issue.fixed_version.name,
					assignee: assignee && usernameToLogin(assignee),
					status: statusesHash[issue.status.name] || 'in progress'
				};
				if (task.assignee && !usersHash[task.assignee]) usersHash[task.assignee] = 1;

				var project = 'redmine';
				if (task.version) {
					var majorVersion = parseMajorVersion(task.version);
					if (majorVersion) project += ' ' + majorVersion + '.x';
				}
				task.project = project;
				if (!projectsHash[task.project]) projectsHash[task.project] = {};
				if (task.version && !projectsHash[task.project][task.version]) {
					projectsHash[task.project][task.version] = 1;
				}
				return task;
			});

			var users = Object.keys(usersHash).map(function(login) {
				return {
					id: login,
					login: login,
					password: createPassword('q')
				};
			});

			var projects = Object.keys(projectsHash).map(function(name) {
				return {
					name: name,
					versions: Object.keys(projectsHash[name]).map(function(version) {
						return version;
					})
				};
			});

			db.tasks.put(tasks, this.slot());
			db.projects.put(projects, this.slot());
			db.users.put(users, this.slot());
		},
		done
	);
};


function parseMajorVersion(version) {
	var parts = /(\d+\.\d+)/.exec(version);
	return parts && parts[1];
}

function usernameToLogin(username) {
	return username.split(' ')[0].toLowerCase();
}
