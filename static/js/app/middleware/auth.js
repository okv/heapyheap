'use strict';

/**
 * Auth middleware
 */
define(['underscore'], function(_) {
	return function(params) {
		var publicRouteNames = ['login', 'main'];
		params = params || {};
		var isAfterLoginCalled = false;
		return function(route, next) {
			console.log('auth middleware')
			if (!this.user && !_(publicRouteNames).contains(route.name)) {
				this.returnUrl = window.location.pathname + window.location.search;
				this.navigate('login');
			} else if (
				this.user && route.name !== 'login' &&
				params.afterLogin && !isAfterLoginCalled
			) {
				params.afterLogin(this.user, next);
				isAfterLoginCalled = true;
			} else {
				next();
			}
		};
	};
});