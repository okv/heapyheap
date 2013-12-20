'use strict';

var gulp = require('gulp'),
	spawn = require('child_process').spawn,
	less = require('gulp-less'),
	jade = require('gulp-jade'),
	wrapAmd = require('gulp-wrap-amd');

var server = null;
gulp.task('runServer', function() {
	if (server) server.kill();
	server = spawn('node', ['app.js'], {stdio: 'inherit'});
});

gulp.task('compileLess', function() {
	gulp.src('static/css/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('static/css'))
});

gulp.task('compileClientTemplates', function() {
	gulp.src('views/templates/**/*.jade')
		.pipe(jade({client: true, compileDebug: false}))
		.pipe(wrapAmd({
			deps: ['jadeRuntime'],
			params: ['jade']
		}))
		.pipe(gulp.dest('static/js/app/templates/'))
});

gulp.task('default', function() {
	// run tasks at gulp start
	gulp.run('runServer', 'compileClientTemplates', 'compileLess');
	// compile less -> css on file changes
	gulp.watch(['static/css/**/*.less'], function(event) {
		gulp.run('compileLess');
	});
	// restart server on file changes
	gulp.watch(['**/*.js', '!static/**'], function(event) {
		gulp.run('runServer');
	});
	// compile client side jade -> js on file changes
	gulp.watch(['views/templates/**/*.jade'], function(event) {
		gulp.run('compileClientTemplates');
	});
});
