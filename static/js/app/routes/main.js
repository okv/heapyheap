'use strict';

define([], function() {
	return function(router) {
		router.route('', 'main', function() {
			if (!router.user) {
				this.navigate('login', {trigger: true});
			} else {
				this.navigate('tasks', {trigger: true});
			}
		});
	};
});
