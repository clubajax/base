define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/Widget'
], function(dcl, dom, Widget){
	
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
	
	return dcl(Widget, {
		declaredClass:'Menu',
		baseClass:'base-menu',
		containerClass:'menu-container',
		menuItemClass:'menu-item',
		
		options:null,
		selectedIndex:0,
		
		nodeIsReference:true,
		
		// if true, value will remain blank until user selected
		noDefault:false,
		
		// not impl
		selectedOptions:null,
		multiple:false,
		autofocus:false,
		
		template:'<div id="{{id}}" class="{{baseClass}}" ><div class="{{containerClass}}" data-ref="containerNode"></div></div>',
		
		constructor: function(options, node){
			this.options = this.options || [];
			this.optionsMap = {};
			this.refNode = node;
			if(options.list){
				this.add(options.list);
			}
		},
		
		postCreate: function(){
			this.on(this.node, 'click', this.onClick, this);
			this.clickOffHandle = this.on(document.body, 'click', function(event){
				if(event.target === this.node || this.node.contains(event.target)){
					return true;
				}else{
					this.hide();
				}
				return false;
			}, this);
			this.clickOffHandle.pause();
		},
		
		onClick: function(event){
			var value = event.target.getAttribute('value');
			
			if(value === undefined || value === null || !this.optionsMap[value]){
				return true;
			}
			
			if(this.selectedIndex > -1){
				this.options[this.selectedIndex].selected = false;
			}
			this.selectedIndex = this.optionsMap[value].index;
			this.options[this.selectedIndex].selected = true;
			console.log('selected', this.selectedIndex, this.options[this.selectedIndex]);
			this.built = false;
			this.build();
			this.hide();
			this.emit('change', value);
			return true;
		},
		
		clear: function(){
			this.optionsMap = {};
			this.options.length = 0;
			
			this.value = '';
			this.label = '';
			
		},
		
		add: function(option){
			if(Array.isArray(option)){
				option.forEach(function(o){ this.add(o); }, this);
				return;
			}
			
			var
				value,
				text,
				selected,
				item;
			
			if(typeof option === 'object'){
				value = option.value;
				text = option.text || option.label;
				selected = option.selected;
			}else{
				value = text = option;
			}
			
			item = {
				value:value,
				text:text,
				index: this.options.length
			};
			this.optionsMap[value] = item;
			this.options.push(item);
			
			if(this.options.length - 1 === this.selectedIndex){
				item.selected = true;
				this.value = item.value;
				this.label = item.text;
			}
			
			this.built = false;
		},
		
		show: function(){
			if(this.showing){
				console.log('showin already');
				return;
			}
			console.log('show!');
			this.showing = true;
			if(!this.built){
				this.build();
			}
			document.body.appendChild(this.node);
			setTimeout(function(){
				this.clickOffHandle.resume();
			}.bind(this), 300);
			this.emit('change-visible', true);
		},
		
		hide: function(){
			if(!this.showing){
				return;
			}
			console.log('hide!');
			this.showing = false;
			document.body.removeChild(this.node);
			this.clickOffHandle.pause();
			this.emit('change-visible', false);
		},
		
		build: function(){
			console.log('build!');
			this.containerNode.innerHTML = '';
			var
				i,
				css,
				pos = dom.box(this.refNode);
			for(i = 0; i < this.options.length; i++){
				css = this.options[i].selected ? this.menuItemClass + ' selected' : this.menuItemClass;
				dom('div', {css:css, attr:{html:this.options[i].text, value:this.options[i].value}}, this.containerNode);
			}
			
			dom.style(this.node, {
				top: pos.top + pos.height,
				left: pos.left
			});
			
			this.built = true;
		}
	});
});