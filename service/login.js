'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db');

module.exports = function(socket) {
	socket.on('login', function(login, password, callback) {
		Steppy(
			function() {
				db.users.get({login: login, password: password}, this.slot());
			},
			function(err, user) {
				//callback(user);
				callback({login: 'spike'});
			}
		);
	});
};
