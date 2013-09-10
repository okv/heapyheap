'use strict';

requirejs.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app',
		socketio: '/socket.io/socket.io.js'
	},
	shim: {
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
