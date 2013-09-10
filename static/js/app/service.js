'use strict';

define(['socketio'], function(socketio) {

	function Service() {
		this.socket = io.connect();
	}

	Service.prototype.login = function(login, password, callback) {
		var self = this;
		this.socket.emit('login', login, password, function(user) {
			if (user.login) {
				if (self.onLogin) self.onLogin(user);
			}
			callback(user);
		});
	};

	return Service;
});
