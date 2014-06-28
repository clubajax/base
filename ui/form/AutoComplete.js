define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/on',
	'base/core/registry',
	'../common/Menu',
	'./DropDown'
], function(dcl, dom, on, registry, Menu, DropDown){

	return dcl(DropDown, {
		declaredClass:'AutoComplete',
		baseClass:'base-autocomplete-input base-field',
		wrapClass:'base-input-wrap base-autocomplete base-field',
		
		itemClass:'base-autocomplete-item',
		popupClass:'base-autocomplete-popup',
		listClass:'base-autocomplete-list',
		containerClass:'base-autocomplete-container',
		inputWrapperClass:'base-autocomplete-inputwrap',
		inputClass:'base-autocomplete-input base-field',
		buttonClass:'base-autocomplete-done',
		
		template:'<div class="{{wrapClass}}"><input class="{{baseClass}}" data-ref="inputNode,keyup:onKeyUp"  /></div>',
		
		// placeholder text
		placeholder:'Type here',
		
		// text for Done button
		doneText:'Done',
		
		// Data store (required)
		store:null,
		// or...
		// Data store fetched from registry
		storeId:'',
		
		// delimeter
		// If set, assumes multiple selections are allowed
		delimeter:'',
		
		// freetext
		//	If true, does not ensure that typed text is in one
		//	of the server results items
		freetext:false,
		
		// useWildcard
		// If any, adds wildcard character to end of query string
		wildcard:'*',
		
		// queryName:
		// The name of the property to request from the server
		queryName:'',
		
		// debounce
		// The number of milliseconds between key presses before
		// fetching new data from the server
		debounce:400,
		
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
		
		constructor: function(){
			if(this.store){
				this.setStore(this.store);
			}else if(this.storeId){
				registry.getStore(this.storeId, this.setStore.bind(this));
			}else{
				console.warn('no store asscoiated with AutoComplete');
			}
		},
		
		postRender: function(){
			this.menu = new Menu({noDefault:this.noDefault, hideChecked:true}, this.node);
			this.menu.on('change', function(value){
				this.setValue(value);
			}, this);
		},
		
		setStore: function(store){
			this.store = store;
			this.store.on('items', function(items){
				this.onItems(items);
			}, this);
			this.store.on('data-begin', function(){
				this.setLoading(true);
			}, this);
			this.store.on('data-end', function(){
				this.setLoading(false);
			}, this);
		},
		
		onItems: function(items){
			
			var i, id, value, options = [];
			for(i = 0; i < items.length; i++){
				id = this.store.getId(items[i]);
				value = this.store.getValue(items[i]);
				options.push({value:value, label:value});
			}
			this.menu.hide();
			this.menu.clear();
			this.menu.add(options);
			this.menu.show();
		},
		
		onKeyUp: function(e){
			clearTimeout(this.debounceHandle);
			//console.log('key', e.keyCode);
			switch(e.keyCode){
				case 27:
					// ESC
					this.menu.hide();
					break;
				case 13:
					// ENTER
					this.onEnter(this.inputNode.value);
					break;
				default:
					this.debounceHandle = setTimeout(this.query.bind(this), this.debounce);
			}
			
						
		},
		
		setValue: function(value){
			this.inputNode.value = value;
			this.__value = value;
			if(!this.freetext){
				//validate
				if(!this.store.byValue(value)){
					this.inputNode.classList.add('invalid');
				}
			}
		},
		
		onEnter: function(value){
			this.menu.hide();
			this.setValue(value);
		},
		
		query: function(){
			if(this.inputNode.value === this.lastValue){
				console.log('block dupe query');
				return;
			}
			this.lastValue = this.inputNode.value;
			
			// TODO?
			// So many possibilities of different server setups that
			// it's kind of hard to know how to supply parameters for
			// customizations.
			// Probably a Store thing that should normalize different
			// cases.
			// 
			//console.log('QUERY', this.inputNode.value);
			
			var
				//value,
				words,
				query = {};
			
			query.name = this.queryName;
			
			if(this.delimeter && this.inputNode.value.indexOf(this.delimeter) > -1){
				console.log('cursor position', this.inputNode.selectionStart);
				console.log('comma position', this.inputNode.value.indexOf(this.delimeter));
				
				words = this.inputNode.value.split(',');
			}
			
			query.value = window.escape(this.inputNode.value) + this.wildcard;
			this.store.query(query);
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
		}
		
	});
});