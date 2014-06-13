'use strict';

define([
	'app/views/base', 'app/templates/components/select'
], function(
	ParentView, template
) {
	var View = {
		template: template
	};

	View.events = {
		'change': 'onChange'
	};

	View.getData = function() {
		return {params: this.data};
	};

	View.getValue = function() {
		return this.isAttached() ? this.$el.val() : this.data.selected;
	};

	View.setValue = function(value) {
		this.$el.val(value);
	};

	View.onChange = function(event) {
		this.trigger('change', event);
	};

	return ParentView.extend(View);
});
