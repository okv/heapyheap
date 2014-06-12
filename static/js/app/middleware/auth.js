'use strict';

/**
 * Auth middleware
 */
define(['underscore'], function(_) {
	return function(params) {
		var publicRoutesUrls = ['login', ''];
		params = params || {};
		var isAfterLoginCalled = false;
		return function(route, next) {
			console.log('auth middleware');
			var app = this.router.app;
			if (!app.currentUser && !_(publicRoutesUrls).contains(route.url)) {
				app.returnUrl = window.location.pathname + window.location.search;
				this.router.navigate('');
			} else if (
				app.currentUser && route.url !== 'login' &&
				params.afterLogin && !isAfterLoginCalled
			) {
				params.afterLogin(app.currentUser, next);
				isAfterLoginCalled = true;
			} else {
				next();
			}
		};
	};
});