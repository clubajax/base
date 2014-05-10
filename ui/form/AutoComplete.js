define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/on',
	'base/core/Widget',
	'base/core/registry'
], function(dcl, dom, on, Widget, registry){

	return dcl(Widget, {
		declaredClass:'AutoComplete',
		baseClass:'base-autocomplete base-field',
		itemClass:'base-autocomplete-item',
		popupClass:'base-autocomplete-popup',
		listClass:'base-autocomplete-list',
		containerClass:'base-autocomplete-container',
		inputWrapperClass:'base-autocomplete-inputwrap',
		inputClass:'base-autocomplete-input base-field',
		buttonClass:'base-autocomplete-done',
		
		template:'<div class="{{baseClass}}" data-ref="click:onClick" data-bind=text:value></div>',
		
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
		
		observables:{
			value:''
		},
		
		constructor: function(){
			if(this.store){
				this.setStore(this.store);
			}else if(this.storeId){
				registry.getStore(this.storeId, this.setStore.bind(this));
			}else{
				console.warn('no store asscoiated with AutoComplete');
			}
			
			this.clickoffHandle = on(document.body, 'click', function(e){
				//console.log('DOCCLICK', e.target,
				//	(this.containerNode && this.containerNode.contains(e.target)),
				//	(this.listNode && this.listNode.contains(e.target)));
				//
				if((this.containerNode && this.containerNode.contains(e.target)) || (this.listNode && this.listNode.contains(e.target))){
					return;
				}
				this.hideInput();
				this.hidePopup();
			}, this);
			this.clickoffHandle.pause();
		},
		
		setStore: function(store){
			this.store = store;
			this.store.on('items', function(items){
				this.onItems(items);
			}, this);
		},
		
		onItems: function(items){
			if(!this.inputShowing){
				// typed and hit enter, before results returned
				return;
			}
			this.showPopup();
			this.listNode.innerHTML = '';
			var i, id, value;
			for(i = 0; i < items.length; i++){
				id = this.store.getId(items[i]);
				value = this.store.getValue(items[i]);
				dom('div', {css:this.itemClass, html:value, attr:{'data-id':id}}, this.listNode);
			}
		},
		
		onKey: function(e){
			clearTimeout(this.debounceHandle);
			console.log('key', e.keyCode);
			switch(e.keyCode){
				case 27:
					// ESC
					//this.onEnter(this.value());
					this.hidePopup();
					this.hideInput();
					this.inputNode.blur();
					break;
				case 13:
					// ENTER
					this.onEnter(this.inputNode.value);
					break;
				default:
					this.debounceHandle = setTimeout(this.query.bind(this), this.debounce);
			}
			
						
		},
		
		onEnter: function(value){
			this.hidePopup();
			this.hideInput();
			this.inputNode.blur();
			this.value(value);
			this.node.classList.remove('invalid');
			if(!this.freetext){
				//validate
				if(!this.store.byValue(value)){
					this.node.classList.add('invalid');
				}
			}
		},
		
		query: function(){
			if(this.inputNode.value === this.lastValue){
				//console.log('BLOCK SAME');
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
		
		showPopup: function(){
			if(!this.popupNode){
				this.buildPopup();
			}else if(!this.popupShowing){
				this.listNode.innerHTML = '';
				dom.show(this.popupNode);
			}
			this.popupShowing = true;
		},
		
		hidePopup: function(){
			//if(!this.popupShowing){ return; }
			if(this.popupNode){
				dom.hide(this.popupNode);
			}
			this.popupShowing = false;
			this.lastValue = '';
		},
		
		showInput: function(){
			if(this.inputShowing){ return; }
			if(!this.containerNode){
				this.buildInput();
			}
			this.node.classList.add('disabled');
			this.inputNode.value = this.value();
			this.inputShowing = true;
			window.requestAnimationFrame(function(){
				this.containerNode.classList.add('show');	
			}.bind(this));
			
			setTimeout(function(){
				this.clickoffHandle.resume();
				this.inputNode.focus();
			}.bind(this), 300);
			
		},
		
		hideInput: function(){
			//if(!this.inputShowing){ return; }
			this.containerNode.classList.remove('show');
			this.node.classList.remove('disabled');
			this.inputShowing = false;
			this.clickoffHandle.pause();
		},
		
		
		buildPopup: function(){
			this.popupNode = dom('div', {css:this.popupClass}, document.body);
			this.listNode = dom('div', {css:this.listClass}, this.popupNode);
			this.on(this.listNode, 'click div.'+this.itemClass, function(e){
				var
					id = dom.attr(e.selectorElement, 'data-id'),
					item = this.store.byId(id),
					value = this.store.getValue(item);
					
				console.log('click', value, e.selectorElement);
				this.onEnter(value);
				this.emit('value', value);
				this.emit('item', item);
			}, this);
		},
		
		buildInput: function(){
			this.containerNode = dom('div', {css:this.containerClass}, document.body);
			this.inputWrap = dom('div', {css:this.inputWrapperClass}, this.containerNode);
			this.inputNode = dom('input', {css:this.inputClass, attr:{placeholder:this.placeholder}}, this.inputWrap);
			this.doneBtn = dom('button', {css:this.buttonClass, html:this.doneText}, this.containerNode);
			this.on(this.inputNode, 'keydown', this.onKey, this);
			this.on(this.doneBtn, 'click', function(){
				this.onEnter(this.inputNode.value);	
			}, this);
			
		},
		
		onClick: function(e){
			this.showInput();
		},
		
		onKeyup: function(e){
			//	console.log('key', e);
			//	console.log('value', this.node.value);
		}
	});
});