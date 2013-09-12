define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
buf.push("<div style=\"padding: 200px 200px 0px 250px;\"><table class=\"pure-table\"><thead><tr><th>Task</th><th>Status</th></tr></thead><tbody id=\"tasks-table-body\"></tbody></table></div>");;return buf.join("");
};
});
