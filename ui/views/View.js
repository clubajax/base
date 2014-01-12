define([
	'core/dcl',
	'core/dom',
	'core/parser',
	'core/Widget',
	'./manager'
], function(dcl, dom, parser, Widget, manager){

	return dcl(Widget, {
		declaredClass:'View',
		
		baseClass:'base-view',
		className:'',
		headerClass:'base-view-header',
		containerClass:'base-view-container',
		footerClass:'base-view-footer',
		navButtonClass:'base-view-nav-button',
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
		
		buttons:null,
		
		constructor: function(options, node){
			this.appendNode = node.parentNode;
		},
		
		postCreate: function(){
			if(this.content && typeof this.content === 'object'){
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
			
			manager.add(this);
			
			if(this.buttons){
				this.insertNavButtons(this.buttons);
			}
			
			
		},
		
		postRender: function(){
			console.log('VIEW.parsedChildNodes', this.parsedChildNodes);
			if(this.parsedChildNodes){
				this.linkChildren();
			}
		},
		
		insertNavButton: function(viewId, label){
			var btn = dom('button', {html:label, css:this.navButtonClass}, this.containerNode);
			this.on(btn, 'click', function(){
				manager.select(viewId);
			}, this);
		},
		
		linkChildren: function(){
			var i, id, title, doParse = 0;
			for(i = 0; i < this.parsedChildNodes.length; i++){
				if(dom.attr(this.parsedChildNodes[i], 'data-widget') === this.declaredClass){
					id = dom.attr(this.parsedChildNodes[i], 'id');
					title = dom.attr(this.parsedChildNodes[i], 'title');
					this.insertNavButton(id, title);
				}else{
					this.containerNode.appendChild(this.parsedChildNodes[i]);
					doParse = 1;
				}
			}
			
			if(doParse){
				parser.parse(this.containerNode);
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