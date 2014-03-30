define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/parser/main',
	'base/core/parser/parser-attributes',
	'base/core/Widget',
	'./manager'
], function(dcl, dom, parser, dataAttr, Widget, manager){

	return dcl(Widget, {
		declaredClass:'View',
		
		baseClass:'base-view',
		className:'',
		headerClass:'base-view-header',
		containerClass:'base-view-container',
		footerClass:'base-view-footer',
		navButtonClass:'base-view-nav-button',
		
		title:'',
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
		icon:null,
		headerIcon:null,
		
		buttons:null,
		
		constructor: function(options, node){
			this.appendNode = node.parentNode;
		},
		
		postCreate: function(){
			if(this.content && typeof this.content === 'object'){
				this.containerNode.appendChild(this.content.node);
			}else{
				this.containerNode.innerHTML = this.content || '';
				this.parseChildNodes(this.containerNode);
			}
			if(this.headerContent || this.back){
				if(this.headerContent){
					this.headerNode.innerHTML = this.headerContent;
					this.parseChildNodes(this.headerNode);
				}
				if(this.back){
					this.backNode = dom('div', {css:'base-view-back', html:'<span>'+this.backText+'</span>'});
					this.headerNode.appendChild(this.backNode);
					this.on(this.backNode, 'click', function(){
						this.emit('navigate', this.back);
					}, this);
				}else if(this.headerIcon){
					dom('div', {css:this.headerIcon}, this.headerNode);
				}
				this.node.classList.add('hasHeader');
			}
			if(this.footerContent){
				this.footerNode.innerHTML = this.footerContent;
				this.parseChildNodes(this.footerNode);
				this.node.classList.add('hasFooter');
			}
			
			manager.add(this);
			
			if(this.buttons){
				this.insertNavButtons(this.buttons);
			}
			
			// Note, children are not available here
		},
		
		postRender: function(){
			if(this.parsedChildNodes){
				this.linkChildren();
			}
		},
		
		insertNavButton: function(child){
			var
				css = this.navButtonClass + (child.icon ? ' icon ' + child.icon : ''),
				btn = dom('button', {html:child.title, css:css}, this.containerNode);
			this.on(btn, 'click', function(){
				manager.select(child.id);
			}, this);
		},
		
		linkChildren: function(){
			var i, doParse = 0, child, dc;
			for(i = 0; i < this.parsedChildNodes.length; i++){
				dc = dom.attr(this.parsedChildNodes[i], 'data-widget');
				if(dc === this.declaredClass || /View/.test(dc)){ // need a better test, like instanceOf of something
					child = this.getChildbyNode(this.parsedChildNodes[i]);
					this.insertNavButton(child);
				}else{
					this.containerNode.appendChild(this.parsedChildNodes[i]);
					doParse = 1;
				}
			}
			
			if(doParse){
				this.parseChildNodes(this.containerNode);
			}
			
		},
		
		insertNavButtons: function(buttons){
			var key;
			for(key in buttons){
				if(buttons.hasOwnProperty(key)){
					this.insertNavButton(key, buttons[key]);
				}
			}
		}
	});
});
