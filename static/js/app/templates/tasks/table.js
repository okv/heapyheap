define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
buf.push("<table class=\"pure-table\"><thead><tr><th>Task</th><th>Status</th></tr></thead><tbody id=\"tasks-table-body\"></tbody></table>");;return buf.join("");
};
});
