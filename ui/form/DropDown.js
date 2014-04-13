define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/Widget',
	'../common/Menu',
	'base/core/registry'
], function(dcl, dom, Widget, Menu, registry){
	
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
		
		store:null,
		
		// non standard
		label:'',
		menuShowing: false,
		
		// not impl
		selectedOptions:null,
		multiple:false,
		autofocus:false,
		
		template:'<div id="{{id}}" class="{{baseClass}}" data-ref="click:onClick">{{label}}</div>',
		
		constructor: function(options, node){
			this.options = this.options || [];
			this.optionsMap = {};
			this.selectedItem = null;
			this.optionsArray = options.list || options.options;
			this.appendNode  = dom('div');
			console.log('node', node);
			if(this.store){
				this.setStore(this.store);
			}else if(this.storeId){
				registry.getStore(this.storeId, this.setStore.bind(this));
			}
			
		},
		
		setStore: function(store){
			console.log('STORE');
			this.store = store;
			this.store.getData(this.setOptions.bind(this));
			this.store.on('items', function(items){
				this.setOptions(items);
			}, this);
		},
		
		onClick: function(){
			if(!this.menuShowing){
				this.menu.show();
			}else{
				this.menu.hide();
			}
		},
		
		postRender: function(){
			console.log('this.node', this.node);
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
			if(!this.selectedItem){
				this.setSelectedItem(this.options[0]);
			}
		},
		
		setSelectedItem: function(item){
			if(!item){
				this.node.innerHTML = '';
				return;
			}
			item.selected = true;
			this.selectedItem = item;
			this.value = item.value;
			this.label = item.text;
			this.node.innerHTML = this.label;
			//console.log('selected', this.label, this.node);
			//setTimeout(function(){ console.log('selected', this.label, this.node); }.bind(this), 100);
			
		},
		
		setOptions: function(options){
			this.menu.clear();
			this.clear();
			this.add(options);
		},
		
		clear: function(){
			this.options.length = 0;
			this.optionsMap = {};
			this.setSelectedItem('');
		},
		
		add: function(option){
			console.log('ADD');
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
				this.setSelectedItem(item);
			}
			this.menu.add(item);
		}
	});

});