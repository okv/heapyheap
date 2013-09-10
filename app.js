'use strict';

var http = require('http'),
	Steppy = require('twostep').Steppy,
	nodeStatic = require('node-static'),
	socketio = require('socket.io');

var env = process.env.NODE_ENV || 'development',
	conf = process.env.NODE_CONF || 'development',
	config = require('./config')(conf);

console.log('config:', conf);
console.log('environment:', env);

var staticServer = new nodeStatic.Server(__dirname + '/static')
var server = http.createServer(function(req, res) {
	staticServer.serve(req, res);
});

var io = socketio.listen(server);
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
