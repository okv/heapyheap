'use strict';

define(['app/views/base'], function(ParentView) {
	var View = {};

	View.events = {
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
	};

	View.render = function() {
		this.$el.html(this._render('users/list', {
			users: this.collection.toJSON()
		}));
		return this;
	};

	return ParentView.extend(View);
});
