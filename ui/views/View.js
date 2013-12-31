define([
	'core/dcl',
	'core/parser',
	'core/Widget'
], function(dcl, parser, Widget){

	return dcl(Widget, {
		declaredClass:'View',
		
		baseClass:'base-view',
		className:'',
		
		template:'<div class="{{baseClass}} {{className}}"></div>',
		
		content:null, // widget or html
		
		constructor: function(){
			
		},
		
		postRender: function(){
			this.node.innerHTML = this.content || '';
			parser.parse(this.node);
		}
	});
});