'use strict';

var inherits = require('util').inherits;

exports.WrongCredentials = WrongCredentials;

function BaseError() {
	Error.captureStackTrace(this);
}
inherits(BaseError, Error);

function WrongCredentials() {
	BaseError.apply(this, arguments);
	this.name = 'WrongCredentials';
	this.message = 'Wrong login or password';
	this.userMessage = this.message;
}
inherits(WrongCredentials, BaseError);
