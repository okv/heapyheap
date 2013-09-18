define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
buf.push("<div style=\"padding: 200px 200px 0px 250px;\"><form class=\"pure-form\"><select id=\"filter-project\" class=\"task-filters\"><option value=\"\">Any project</option></select><select id=\"filter-version\" class=\"task-filters\"><option value=\"\">Any version</option></select><select id=\"filter-assignee\" class=\"task-filters\"><option value=\"\">Any assignee</option></select><select id=\"filter-status\" class=\"task-filters\"><option value=\"\">Any status</option><option>undone</option><option>waiting</option><option>in progress</option><option>done</option></select></form><div class=\"pure-g\"><div class=\"pure-u-1-3\"><table class=\"pure-table\"><thead><tr><th>Task</th><th>Status</th></tr></thead><tbody id=\"tasks-table-body\"></tbody></table></div><div class=\"pure-u-2-3\"><div id=\"task-full\"></div></div></div><button style=\"margin-top: 30px;\" id=\"task-change-status\" class=\"pure-button pure-button-primary\">Change status</button></div>");;return buf.join("");
};
});
