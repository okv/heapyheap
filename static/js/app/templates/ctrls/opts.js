define(['jadeRuntime'], function(jade) {
return function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),placeholder = locals_.placeholder,opts = locals_.opts;if ( placeholder)
{
buf.push("<option value=\"\">" + (jade.escape((jade.interp = placeholder) == null ? '' : jade.interp)) + "</option>");
}
// iterate opts
;(function(){
  var $$obj = opts;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var opt = $$obj[$index];

buf.push("<option" + (jade.attrs({ 'value':("" + (opt) + "") }, {"value":true})) + ">" + (jade.escape((jade.interp = opt) == null ? '' : jade.interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var opt = $$obj[$index];

buf.push("<option" + (jade.attrs({ 'value':("" + (opt) + "") }, {"value":true})) + ">" + (jade.escape((jade.interp = opt) == null ? '' : jade.interp)) + "</option>");
    }

  }
}).call(this);
;return buf.join("");
};
});
