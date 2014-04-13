define([
	'base/core/dcl',
	'base/core/Widget',
], function(dcl, Widget){

	return dcl(Widget, {
		declaredClass:'Input',
		template:"<div class='base-input-wrap base-field'><input class='base-input base-field' data-bind=text:value /></div>",
		observables:{
			value:''
		},
		constructor: function(){
			
		}
	});
});