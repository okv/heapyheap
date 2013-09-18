define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),task = locals_.task;buf.push("<div>" + (jade.escape((jade.interp = task.title) == null ? '' : jade.interp)) + "</div><div>" + (jade.escape((jade.interp = task.status) == null ? '' : jade.interp)) + "</div><div>" + (jade.escape((jade.interp = task.description) == null ? '' : jade.interp)) + "</div>");;return buf.join("");
};
});
