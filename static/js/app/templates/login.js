define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
buf.push("<div style=\"padding: 200px 200px 0px 250px;\"><form class=\"pure-form pure-form-stacked\"><fieldset><legend>Please enter login and password</legend><input id=\"login\" type=\"text\" placeholder=\"Login\"/><input id=\"password\" type=\"password\" placeholder=\"Password\"/><button id=\"login-button\" type=\"button\" class=\"pure-button pure-button-primary\">Login</button></fieldset></form></div>");;return buf.join("");
};
});
