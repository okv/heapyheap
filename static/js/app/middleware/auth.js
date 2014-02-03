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
			console.log('auth middleware')
			if (!this.router.user && !_(publicRouteNames).contains(route.name)) {
				this.router.returnUrl = window.location.pathname + window.location.search;
				this.router.navigate('login');
			} else if (
				this.router.user && route.name !== 'login' &&
				params.afterLogin && !isAfterLoginCalled
			) {
				params.afterLogin(this.router.user, next);
				isAfterLoginCalled = true;
			} else {
				next();
			}
		};
	};
});