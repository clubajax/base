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
		
		// if true, value will remain blank until user selected
		noDefault:false,
		
		
		// not impl
		selectedOptions:null,
		multiple:false,
		autofocus:false,
		
		template:'<div id="{{id}}" class="{{baseClass}}" data-ref="click:onClick">{{label}}</div>',
		
		properties:{
			value:{
				get: function(){
					return this.__value;
				},
				set: function(v){
					this.setValue(v);
				}
			},
			disabled:{
				get: function(){
					return this.__disabled;
				},
				set: function(v){
					this.setDisabled(v, true);
				}
			}
		},
		
		constructor: function(options, node){
			this.options = this.options || [];
			this.optionsMap = {};
			this.selectedItem = null;
			this.optionsArray = options.list || options.options;
			this.appendNode  = dom('div');
			if(this.store){
				this.setStore(this.store);
			}else if(this.storeId){
				registry.getStore(this.storeId, this.setStore.bind(this));
			}
			
		},
		
		setStore: function(store){
			this.store = store;
			this.store.getItems(this.setOptions.bind(this));
			this.store.on('data-begin', function(){
				this.setValue('');
				this.setLoading(true);
			}, this);
			this.store.on('data-end', function(){
				this.setLoading(false);
			}, this);
			this.store.on('items', function(items){
				this.setOptions(items);
			}, this);
		},
		
		onClick: function(){
			if(this.__disabled){
				return;
			}
			if(!this.menuShowing){
				this.menu.show();
			}else{
				this.menu.hide();
			}
		},
		
		postRender: function(){
			this.setDisabled(true); // disabled until there are options
			this.menu = new Menu({noDefault:this.noDefault}, this.node);
			this.add(this.optionsArray);
			
			this.menu.on('change-visible', function(value){
				this.menuShowing = value;
			}, this);
			
			this.menu.on('change', function(value){
				this.setValue(value);
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
		
		setDisabled: function(disabled){
			if(this.__disabled === disabled){
				return;
			}
			this.__disabled = disabled;
			if(disabled){
				this.node.classList.add('disabled');
			}else{
				this.node.classList.remove('disabled');
			}
		},
		
		setLoading: function(loading){
			if(this.loading === loading){
				return;
			}
			this.loading = loading;
			if(loading){
				this.node.classList.add('loading');
			}else{
				this.node.classList.remove('loading');
			}
		},
		
		setValue: function(value, silent){
			var item;
			if(value === null || value === '' || value === undefined){
				this.node.innerHTML = '';
				item = {value:''};
			}else{
				item = this.optionsMap[value];
				if(!item){
					console.warn('Attempt to set invalid property "',value,'" for options:', this.options);
					return;
				}
				this.node.innerHTML = item.text;
			}
			
			this.__value = item.value;
			if(!silent){
				this.emit('change', this.__value);
			}
		},
		
		setSelectedItem: function(item){
			if(!item){
				this.node.innerHTML = '';
				return;
			}
			item.selected = true;
			this.selectedItem = item;
			this.__value = item.value;
			this.label = item.text;
			this.node.innerHTML = this.label;
		},
		
		setOptions: function(options){
			if(this.noDefault){
				this.selectedIndex = -1;
				this.menu.selectedIndex = -1;
			}
			this.menu.clear();
			this.clear();
			this.add(options);
			
			this.emit('options-add', options);
		},
		
		clear: function(){
			this.options.length = 0;
			this.optionsMap = {};
			this.setSelectedItem('');
			this.emit('options-clear');
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
				this.setSelectedItem(item);
			}
			this.menu.add(item);
			this.setDisabled(false);
			this.emit('option-add', item);
		}
	});

});