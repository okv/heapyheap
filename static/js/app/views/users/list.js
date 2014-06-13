'use strict';

define([
	'app/views/base', 'app/templates/users/list'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.getData = function() {
		return {users: this.collection.toJSON()};
	};

	return ParentView.extend(View);
});
