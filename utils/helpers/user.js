'use strict';

var crypto = require('crypto');

var hashSalt = '_noboKnowssss-';

exports.createPassword = function(password) {
	return crypto.createHash('md5').update(
		'salt:' + hashSalt + ':password:' + password
	).digest('hex');
};
