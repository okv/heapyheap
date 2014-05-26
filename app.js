'use strict';

var env = process.env.NODE_ENV || 'development',
	conf = process.env.NODE_CONF || 'development',
	config = require('./config')(conf);

var http = require('http'),
	nodeStatic = require('node-static'),
	socketio = require('socket.io'),
	backboneio = require('backbone.io');


console.log('config:', conf);
console.log('environment:', env);

var staticServer = new nodeStatic.Server(__dirname + '/static');
var server = http.createServer(function(req, res) {
	// serve index for all app pages
	if (
		req.url == '/login' ||
		req.url.indexOf('/tasks') === 0 ||
		req.url.indexOf('/users') === 0
	) {
		staticServer.serveFile('/index.html', 200, {}, req, res);
	} else {
		staticServer.serve(req, res);
	}
});

var backends = require('./backends');
var io = backboneio.listen(server, backends);
io.set('log level', 2);
io.sockets.on('connection', function(socket) {
	require('./service/login')(socket);
});

console.log(
	'[app] Starting server on %s:%s',
	config.listen.host, config.listen.port
);
server.listen(config.listen.port, config.listen.host);
