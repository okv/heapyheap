'use strict';

var http = require('http'),
	jade = require('jade'),
	Steppy = require('twostep').Steppy,
	nodeStatic = require('node-static');

var env = process.env.NODE_ENV || 'development',
	conf = process.env.NODE_CONF || 'development',
	config = require('./config')(conf);

console.log('config:', conf);
console.log('environment:', env);

var staticServer = new nodeStatic.Server(__dirname + '/static')
var server = http.createServer(function(req, res) {
	if (req.url == '/' && req.method == 'GET') {

	} else if (req.url == '/login' && req.method == 'GET') {
		render(res, 'login', {});
	} else {
		staticServer.serve(req, res);
	}
});

function render(res, view, locals) {
	Steppy(
		function() {
			var options = {locals: locals || {}};
			jade.renderFile(
				__dirname + '/views/' + view + '.jade', options, this.slot()
			);
		},
		function(err, html) {
			res.end(html);
		},
		function(err) {
			throw err;
		}
	);
};

console.log(
	'[app] Starting server on %s:%s',
	config.listen.host, config.listen.port
);
server.listen(config.listen.port, config.listen.host);
