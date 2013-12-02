'use strict';

var env = process.env.NODE_ENV || 'development',
	conf = process.env.NODE_CONF || 'development',
	config = require('./config')(conf);

var http = require('http'),
	Steppy = require('twostep').Steppy,
	nodeStatic = require('node-static'),
	socketio = require('socket.io'),
	backboneio = require('backbone.io'),
	db = require('./db');


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
	console.log('>>> backend:', req.backend);
	console.log('>>> method:', req.method);
	console.log('>>> model:', JSON.stringify(req.model));
	next();
});

backend.use('read', function(req, res, next) {
	if (req.model.id) {
		console.log('>>> getting single: ', req.model.id);
		var detailed = req.options.data && req.options.data.detailed;
		if (detailed) db.tasks.get({id: req.model.id}, function(err, obj) {
			if (err) return next(err);
			res.end(obj);
		});
	} else {
		var filters = req.options.data,
			start = {},
			end = {};
		console.log('>>> getting list: ', filters);
		if (filters.status) {
			if (filters.status === 'undone') {
				start.status = 'in progress';
				end.status = 'waiting';
			} else {
				start.status = filters.status;
			}
		}
		Steppy(
			function() {
				db.tasks.find({
					start: start,
					end: end,
					limit: filters.limit
				}, this.slot());
			},
			function(err, objs) {
				var group = this.makeGroup();
				objs.forEach(function(obj) {
					// should find by `listInfo` (when get will supports `by`)
					db.tasks.get({id: obj.id}, group.slot());
				});
			},
			function(err, objs) {
				console.log('>>> obj = ', objs[0])
				res.end(objs);
			},
			next
		);
	}
});

backend.use('update', function(req, res, next) {
	db.tasks.put(req.model, function(err) {
		if (err) return next(err);
		res.end(req.model);
	});
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
