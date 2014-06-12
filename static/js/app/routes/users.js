'use strict';

define([
	'app/views/users/list'
], function(
	UsersListView
) {

	return function(router) {

		var app = router.app,
			models = app.models;

		router.route({
			url: 'users',
			name: 'usersList',
			parentName: 'mainLayout'
		}, function() {
			var self = this;
			models.users.fetch({success: function(collection) {
				self.view = new UsersListView({
					el: '.main-layout',
					collection: collection
				}).render();
			}, reset: true});
		});

	};

});
