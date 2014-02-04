'use strict';

var Steppy = require('twostep'),
	db = require('../db'),
	issues = require('../dev/issues.json');


exports.migrate = function(client, done) {
	var statusesHash = {New: 'waiting', Resolved: 'done'};

	var usersHash = {},
		projectsHash = {};

	Steppy(
		function() {
			var tasks = issues.map(function(issue) {
				var task = {
					id: issue.id,
					title: issue.subject,
					description: issue.description,
					version: issue.fixed_version && issue.fixed_version.name,
					assignee: issue.assigned_to && issue.assigned_to.name,
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

			var users = Object.keys(usersHash).map(function(username) {
				return {username: username};
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
