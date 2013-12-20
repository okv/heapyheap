'use strict';

var gulp = require('gulp'),
	spawn = require('child_process').spawn;

var server = null;
gulp.task('runServer', function() {
	if (server) server.kill();
	server = spawn('node', ['app.js'], {stdio: 'inherit'});
});

gulp.task('default', function() {
	// run server at gulp start
	gulp.run('runServer');
	// restart server on file changes
	gulp.watch(['**/*.js', '!static/**'], function(event) {
		gulp.run('runServer');
	});
	// compile client side jade templates on file changes
	gulp.watch(['views/templates/**/*.jade'], function(event) {
		spawn('node_modules/jade-amd/bin/jade-amd', [
			'--from', event.path, '--to', event.path.replace(
				'/views/templates/', '/static/js/app/templates/'
			)
		], {stdio: 'inherit'});
	});
});
