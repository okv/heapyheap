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

var staticServer = new nodeStatic.Server(__dirname + '/static')
var server = http.createServer(function(req, res) {
	staticServer.serve(req, res);
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
	status: 'waiting'
}, {
	id: 2,
	title: 'Write awesome code',
	status: 'waiting'
}];
backend.use('read', function(req, res, next) {
	if (req.model.id) {
	} else {
		res.end(tasks);
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
