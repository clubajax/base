define([
	'core/dcl',
	'core/dom',
	'core/Widget',
	'../common/Menu'
], function(dcl, dom, Widget, Menu){
	
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
	
	return dcl(Widget, {
		declaredClass:'DropDown',
		baseClass:'base-dropdown base-button',
		
		options:null,
		selectedIndex:0,
		required:false,
		name:'',
		disabled:false,
		value:null,
		
		// non standard
		label:'',
		menuShowing: false,
		
		// not impl
		selectedOptions:null,
		multiple:false,
		autofocus:false,
		
		template:'<div id="{{id}}" class="{{baseClass}}" data-ref="click:onClick">{{label}}</div>',
		
		constructor: function(options){
			this.options = this.options || [];
			this.optionsMap = {};
			this.optionsArray = options.list || options.options;
			this.appendNode  = dom('div');
			
		},
		
		onClick: function(){
			console.log('drop click!');
			if(!this.menuShowing){
				this.menu.show();
			}else{
				this.menu.hide();
			}
		},
		
		postCreate: function(){
			this.menu = new Menu({}, this.node);
			this.add(this.optionsArray);
			
			this.menu.on('change-visible', function(value){
				this.menuShowing = value;
			}, this);
			this.menu.on('change', function(value){
				var item = this.optionsMap[value];
				this.node.innerHTML = item.text;
			}, this);
			
			if(this.appendNode.children.length){
				console.log('CHILLEN');
				var
					i = 0,
					list = [];
				for(i = 0; i < this.appendNode.children.length; i++){
					list.push({
						value: this.appendNode.children[i].getAttribute('value'),
						text: this.appendNode.children[i].innerHTML,
						selected: this.appendNode.children[i].getAttribute('selected')
					});
				}
				this.add(list);
				dom.destroy(this.appendNode);
			}
		},
		
		add: function(option){
			if(!option){
				return;
			}
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
			this.options.push(item);
			this.optionsMap[value] = item;
			
			
			if(this.options.length - 1 === this.selectedIndex){
				item.selected = true;
				this.value = item.value;
				this.label = item.text;
				this.node.innerHTML = this.label;
			}
			this.menu.add(item);
		}
	});

});