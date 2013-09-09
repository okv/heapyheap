'use strict';

requirejs.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app'
	},
	shim: {
		io: '/socket.io/socket.io.js',
		underscore : {
			exports : '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});

requirejs(['app/routes/index'], function(router) {
});
