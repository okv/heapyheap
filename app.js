'use strict';

var http = require('http'),
	Steppy = require('twostep').Steppy,
	nodeStatic = require('node-static'),
	socketio = require('socket.io'),
	backboneio = require('backbone.io'),
	fs = require('fs');

var env = process.env.NODE_ENV || 'development',
	conf = process.env.NODE_CONF || 'development',
	config = require('./config')(conf);

console.log('config:', conf);
console.log('environment:', env);

var staticServer = new nodeStatic.Server(__dirname + '/static');
var server = http.createServer(function(req, res) {
	// serve index for all app pages
	if (req.url == '/login' || req.url.indexOf('/tasks') === 0) {
		staticServer.serveFile('/index.html', 200, {}, req, res);
	} else {
		staticServer.serve(req, res);
	}
});

if (env == 'development') {
	var chokidar = require('chokidar'),
		path = require('path'),
		exec = require('child_process').exec;
	var templatesSrc = __dirname + '/views/templates',
		templatesDst = __dirname + '/static/js/app/templates';
	var compileTemplates = function() {
		exec(
			'node_modules/jade-amd/bin/jade-amd --from ' +
			templatesSrc + ' --to ' + templatesDst,
			function(err, stdout, stderr) {
				if (stdout) console.log('stdout: ' + stdout);
				if (stderr) console.log('stderr: ' + stderr);
				if (err) throw err;
			}
		);
	}
	var compileTemplatesOnChanges = function(filepath, action) {
		console.log(
			'template %s %s', path.relative(templatesSrc, filepath), action
		);
		compileTemplates();
	}
	chokidar.watch(templatesSrc, {ignoreInitial: true})
		.on('add', function(filepath) {
			compileTemplatesOnChanges(filepath, 'added');
		})
		.on('change', function(filepath) {
			compileTemplatesOnChanges(filepath, 'updated');
		});
}

var backend = backboneio.createBackend();
backend.use(function(req, res, next) {
	console.log(req.backend);
	console.log(req.method);
	console.log(JSON.stringify(req.model));
	next();
});

var tasks = [{
	id: 1,
	title: 'Create impressive design',
	status: 'in progress'
}, {
	id: 2,
	title: 'Write awesome code',
	status: 'done'
}];
for (var i = 3; i <= 20; i++) {
	tasks.push({id: i, title: 'Some task ' + i, status: 'waiting'});
}
backend.use('read', function(req, res, next) {
	if (req.model.id) {
	} else {
		var filters = req.options.data;
		var filteredTasks = tasks.filter(function(task) {
			return (!filters.status || filters.status == task.status ||
				(filters.status == 'undone' && task.status != 'done'));
		});
		res.end(filteredTasks);
	}
});
backend.use('update', function(req, res, next) {
	var i = 0;
	while (i < tasks.length && tasks[i].id != req.model.id) {
		i++;
	}
	tasks[i] = req.model;
	res.end(req.model);
});
// log backend errors
backend.use(function(err, req, res, next) {
	if (err) console.log(err.stack || err);
});

var io = backboneio.listen(server, {mybackend: backend});
io.set('log level', 2);
io.sockets.on('connection', function(socket) {
	socket.on('login', function(login, password, callback) {
		callback({login: 'spike'});
	});
});

console.log(
	'[app] Starting server on %s:%s',
	config.listen.host, config.listen.port
);
server.listen(config.listen.port, config.listen.host);
