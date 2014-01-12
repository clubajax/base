define([
	'core/dcl',
	'core/dom',
	'core/parser',
	'core/Widget'
], function(dcl, dom, parser, Widget){

	return dcl(Widget, {
		declaredClass:'View',
		
		baseClass:'base-view',
		className:'',
		headerClass:'base-view-header',
		containerClass:'base-view-container',
		footerClass:'base-view-footer',
		back:'',
		
		backText:'Back',
		
		
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
			if(typeof this.content === 'object'){
				this.containerNode.appendChild(this.content.node);
			}else{
				this.containerNode.innerHTML = this.content || '';
				parser.parse(this.containerNode);
			}
			if(this.headerContent || this.back){
				if(this.headerContent){
					this.headerNode.innerHTML = this.headerContent;
					parser.parse(this.headerNode);
				}
				if(this.back){
					this.backNode = dom('div', {css:'base-view-back', html:'<span>'+this.backText+'</span>'});
					this.headerNode.appendChild(this.backNode);
					this.on(this.backNode, 'click', function(){
						this.emit('navigate', this.back);
					}, this);
				}
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