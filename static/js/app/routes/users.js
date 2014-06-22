'use strict';

define([
	'app/views/users/list'
], function(
	UsersListView
) {

	return function(router) {

		var collections = router.app.collections;

		router.route({
			url: 'users',
			name: 'usersList',
			parentName: 'mainLayout'
		}, function() {
			var self = this;
			collections.users.fetch({success: function(collection) {
				self.view = new UsersListView({
					el: '.main-layout',
					collection: collection
				}).render();
			}});
		});

	};

});
