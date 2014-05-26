'use strict';

var crypto = require('crypto');

var hashSalt = '_noboKnowssss-';

exports.createPassword = function(password) {
	return crypto.createHash('md5').update(
		'salt:' + hashSalt + ':password:' + password
	).digest('hex');
};

exports.createToken = function(user) {
	return crypto.createHash('md5').update(
		[JSON.stringify(user), Date.now(), hashSalt, Math.random()].join(';')
	).digest('hex');
};
