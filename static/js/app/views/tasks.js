'use strict';

define(['backbone', 'app/template'], function(backbone, template) {
	return function(router) {
		var View = {};

		View.initialize = function() {
			var self = this;
			this.collection.on('add', function(model) {
				self.$('#tasks-table-body').append(
					template.render('tasks/tableRow', {task: model.toJSON()})
				);
				model.on('change', function(model) {
					self.$(
						'#tasks-table-body tr[data-task-id=' + model.get('id') + ']'
					).replaceWith(
						template.render('tasks/tableRow', {task: model.toJSON()})
					);
				});
			});
			this.collection.on('backend:update', function(model) {
				this.get(model.id).set(model);
			});
			// temporary
			this.$el.on('click', '#task-change-status', function() {
				var model = self.collection.get(2);
				model.set(
					'status',
					model.get('status') == 'waiting' ? 'in porgress' : 'waiting'
				);
				model.save();
			});
		};

		View.render = function() {
			this.$el.html(template.render('tasks'));
		};

		return backbone.View.extend(View);
	}
});
