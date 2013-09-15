define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
buf.push("<form class=\"pure-form\"><select id=\"filter-project\" class=\"task-filters\"><option value=\"\">Any project</option></select><select id=\"filter-version\" class=\"task-filters\"><option value=\"\">Any version</option></select><select id=\"filter-assignee\" class=\"task-filters\"><option value=\"\">Any assignee</option></select><select id=\"filter-status\" class=\"task-filters\"><option value=\"\">Any status</option><option>undone</option><option>waiting</option><option>in progress</option><option>done</option></select></form>");;return buf.join("");
};
});
