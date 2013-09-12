define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),task = locals_.task;buf.push("<tr" + (jade.attrs({ 'data-task-id':(task.id) }, {"data-task-id":true})) + "><td>" + (jade.escape((jade.interp = task.title) == null ? '' : jade.interp)) + "</td><td>" + (jade.escape((jade.interp = task.status) == null ? '' : jade.interp)) + "</td></tr>");;return buf.join("");
};
});
