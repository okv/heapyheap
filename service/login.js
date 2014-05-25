'use strict';

var Steppy = require('twostep').Steppy,
	db = require('../db'),
	helpers = require('../utils/helpers'),
	errors = require('../utils/errors');

module.exports = function(socket) {
	socket.on('login', function(login, password, callback) {
		Steppy(
			function() {
				var stepCallback = this.slot();
				db.users.get({
					login: login,
					password: helpers.createPassword(password)
				}, function(err, user) {
					if (err) err = new errors.WrongCredentials();
					stepCallback(err, user);
				});
			},
			callback
		);
	});
};
