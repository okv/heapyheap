'use strict';

define(['app/views/base'], function(ParentView) {
	var View = {};

	View.events = {
		'change #project': 'onProjectChange',
		'click #save': 'onSave'
	};

	View.onProjectChange = function() {
		this.renderVersions($('#project').val());
	};

	View.renderVersions = function(project, version) {
		var selProject = this.app.models.projects.findWhere({
			name: project
		});
		this.$('#version').html(this._render('ctrls/opts', {
			placeholder: 'Choose version',
			opts: selProject ? selProject.get('versions') : [],
			selected: version,
			callAtOnce: true
		}));
	};

	View.onSave = function() {
		var self = this;
		this.model
			.set('title', this.$('#title').val())
			.set('project', this.$('#project').val())
			.set('version', this.$('#version').val())
			.set('assignee', this.$('#assignee').val())
			.set('description', this.$('#description').val())
			.save(null, {success: function(model) {
				self.navigate('tasks/' + model.get('id'))
			}});
	};

	View.initialize = function() {
		ParentView.prototype.initialize.apply(this, arguments);
	};

	View.render = function() {
		// render static fields once via template
		this.$el.html(this._render('tasks/form', {
			task: this.model.toJSON(),
			projects: this.app.models.projects.pluck('name'),
			users: this.app.models.users.pluck('username')
		}));
		// render dynamic fields via view
		this.renderVersions(this.model.get('project'), this.model.get('version'));
		return this;
	};

	return ParentView.extend(View);
});
