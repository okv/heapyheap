'use strict';

/**
 * Auth middleware
 */
define(['underscore'], function(_) {
	return function(params) {
		var publicRouteNames = ['login', 'index'];
		params = params || {};
		var isAfterLoginCalled = false;
		return function(route, next) {
			console.log('auth middleware');
			var app = this.router.app;
			if (!app.user && !_(publicRouteNames).contains(route.name)) {
				app.returnUrl = window.location.pathname + window.location.search;
				this.router.navigate('login');
			} else if (
				app.user && route.name !== 'login' &&
				params.afterLogin && !isAfterLoginCalled
			) {
				params.afterLogin(app.user, next);
				isAfterLoginCalled = true;
			} else {
				next();
			}
		};
	};
});