'use strict';

var Steppy = require('twostep'),
	db = require('../db');


exports.migrate = function(client, done) {
	var assignees = [
		'spike', 'cyrus', 'delena', 'shenita', 'aisha', 'nikita',
		'lavette', 'alisia', 'tanisha', 'margorie'
	];
	var statuses = ['waiting', 'in progress', 'done'];
	Steppy(
		function() {
			var tasks = [],
				projects = [];
			for (var i = 0; i < 10; i++) {
				var project = {name: 'project ' + i, versions: []};
				for (var j = 0; j < 5; j++) {
					var version = '0.' + j + '.0',
						fullVersion = project.name + ' ' + version;
					project.versions.push(version);
					for (var k = 0; k < 200; k++) {
						tasks.push({
							id: tasks.length + 1,
							title: 'task ' + k + ' at ' + fullVersion,
							fullVersion: fullVersion,
							assignee: getRandomItem(assignees),
							status: getRandomItem(statuses)
						});
					}
				}
				projects.push(project);
			}
			db.tasks.put(tasks, this.slot());
			db.projects.put(projects, this.slot());
		},
		done
	);
};


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
	return array[getRandomInt(0, array.length - 1)];
}
