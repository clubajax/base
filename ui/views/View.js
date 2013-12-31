define([
	'core/dcl',
	'core/parser',
	'core/Widget'
], function(dcl, parser, Widget){

	return dcl(Widget, {
		declaredClass:'View',
		
		baseClass:'base-view',
		className:'',
		headerClass:'base-view-header',
		containerClass:'base-view-container',
		footerClass:'base-view-footer',
		
		
		
		template:'<div class="{{baseClass}} {{className}}">' +
						'<div data-ref="headerNode" class="{{headerClass}}"></div>' +
						'<div data-ref="containerNode" class="{{containerClass}}"></div>' +
						'<div data-ref="footerNode" class="{{footerClass}}"></div>' +
					'</div>',
		
		headerContent:null,
		content:null,
		footerContent:null,
		
		constructor: function(){
			
		},
		
		postRender: function(){
			this.containerNode.innerHTML = this.content || '';
			parser.parse(this.containerNode);
			
			if(this.headerContent){
				this.headerNode.innerHTML = this.headerContent;
				parser.parse(this.headerNode);
				this.node.classList.add('hasHeader');
			}
			if(this.footerContent){
				this.footerNode.innerHTML = this.footerContent;
				parser.parse(this.footerNode);
				this.node.classList.add('hasFooter');
			}
		}
	});
});