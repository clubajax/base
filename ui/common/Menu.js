define([
	'base/core/on',
	'base/core/dcl',
	'base/core/dom',
	'base/core/Widget'
], function(on, dcl, dom, Widget){
	
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
		
		// do not use checkmarks to inidcate selected item
		hideChecked: false,
		
		// not impl
		selectedOptions:null,
		multiple:false,
		autofocus:false,
		
		
		template:'<div id="{{id}}" class="{{baseClass}}" ><div class="{{containerClass}}" data-ref="containerNode"></div></div>',
		
		properties:{
			value:{
				get: function(){
					return this.__value;
				},
				set: function(v){
					this.setValue(v);
				}
			},
		},
		constructor: function(options, node){
			this.options = this.options || [];
			this.optionsMap = {};
			this.refNode = node;
			if(options.list){
				this.add(options.list);
			}
			
			this.on(window, 'resize', this.hide.bind(this));
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
			this.exec(value);
			return true;
		},
		
		exec: function(value){
			if(value === undefined || value === null || !this.optionsMap[value]){
				console.warn('invalid input');
				return true;
			}
			this.setValue(value);
			this.built = false;
			this.build();
			this.hide();
			this.emit('change', value);
			return true;
		},
		
		setValue: function(value){
			// sets value silently
			this.__value = value;
			if(this.options && this.options.length){
				if(this.selectedIndex > -1){
					this.options[this.selectedIndex].selected = false;
				}
				this.selectedIndex = -1;
				if(this.optionsMap[value]){
					this.selectedIndex = this.optionsMap[value].index;
					this.options[this.selectedIndex].selected = true;
				}
			}
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
			
			if(this.options.length - 1 === this.selectedIndex || this.__value === item.value ){
				item.selected = true;
				this.value = item.value;
				this.label = item.text;
			}
			
			this.built = false;
		},
		
		show: function(){
			if(this.showing){
				return;
			}
			this.showing = true;
			if(!this.built){
				this.build();
			}
			document.body.appendChild(this.node);
			this.position();
			setTimeout(function(){
				this.clickOffHandle.resume();
			}.bind(this), 300);
			this.emit('change-visible', true);
		},
		
		hide: function(){
			if(!this.showing){
				return;
			}
			this.showing = false;
			document.body.removeChild(this.node);
			this.clickOffHandle.pause();
			this.emit('change-visible', false);
		},
		
		position: function(){
			var
				padding = dom.computed(this.containerNode, 'padding-left') +
					dom.computed(this.containerNode, 'padding-right'),
				menuBox = dom.box(this.containerNode),
				winBox = dom.box(window),
				btnBox = dom.box(this.refNode),
				botSpace = winBox.height - (btnBox.top + btnBox.height + winBox.scrollTop),
				topSpace = btnBox.top - winBox.scrollTop,
				w = btnBox.width - padding - 2,
				options = {
					top: btnBox.top + btnBox.height + winBox.scrollTop,
					left: btnBox.left,
					width: w,
					height:'',
					overflow: ''
				};
			
			if(menuBox.height > botSpace){
				if(menuBox.height < topSpace){
					// top, full size
					options.top = btnBox.top - menuBox.height;
					options.overflowX = 'visible';
					options.overflowY = 'visible';
				}else if(botSpace > topSpace){
					// bottom, but scroll
					console.log('bottom scroll');
					options.height = botSpace;
					options.overflowY = 'scroll';
					options.overflowX = 'hidden';
				}else{
					// top, scroll
					options.height = topSpace - 3;
					options.top = 3;
				}
			}else{
				console.log('bottom full');
				// default, bottom, full
				//options.overflowX = 'visible';
				//options.overflowY = 'visible';
			}
			console.log('position', options);
			console.log('bot space', botSpace);
			
			dom.style(this.node, options);
			dom.style(this.containerNode, 'width', w); // assume 2px border
		},
		
		build: function(){
			this.containerNode.innerHTML = '';
			var
				i,
				css;
			for(i = 0; i < this.options.length; i++){
				css = this.options[i].selected && !this.hideChecked ? this.menuItemClass + ' selected' : this.menuItemClass;
				dom('div', {css:css, attr:{html:this.options[i].text, value:this.options[i].value}}, this.containerNode);
			}
			
			this.built = true;
		}
	});
});