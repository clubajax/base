define([
	'../../core/dcl',
	'../../core/dom',
	'../../core/Widget'
], function(dcl, dom, Widget){

	var
		Tree,
		events = {
			rowClick:'row-click'
		};
		
	Tree = dcl(Widget, {
		declaredClass:'BaseTree',
		
		baseClass:'base-tree',
		rowClass:'base-tree-row',
		headerClass:'base-tree-header',
		containerClass:'base-tree-container',
		scrollerClass:'base-tree-scroller',
		
		template:'<div class="{{baseClass}}"><div data-ref="container" class="{{containerClass}}"><div data-ref="scroller" class="{{scrollerClass}}"></div></div></div>',
		
		constructor: function(){
			
		},
		
		render: function(data){
			
		}
	});
	
	return Tree;
});