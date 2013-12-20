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

var backends = require('./backends'),
	backendsHash = {};
for (var name in backends) {
	var backend = backboneio.createBackend();
	backend.use(function(req, res, next) {
		console.log('>>> backend:', req.backend);
		console.log('>>> method:', req.method);
		console.log('>>> model:', JSON.stringify(req.model));
		next();
	});

	backends[name].bind(backend);
	backendsHash[name] = backend;

	// log backend errors
	backend.use(function(err, req, res, next) {
		if (err) console.log(err.stack || err);
	});
}

var io = backboneio.listen(server, backendsHash);
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
