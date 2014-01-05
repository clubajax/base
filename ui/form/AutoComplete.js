define([
	'core/dcl',
	'core/dom',
	'core/Widget'
], function(dcl, dom, Widget){

	return dcl(Widget, {
		declaredClass:'AutoComplete',
		baseClass:'base-autocomplete base-field',
		itemClass:'base-autocomplete-item',
		popupClass:'base-autocomplete-popup',
		listClass:'base-autocomplete-list',
		containerClass:'base-autocomplete-container',
		inputClass:'base-autocomplete-input base-field',
		buttonClass:'base-autocomplete-done',
		
		template:'<div class="{{baseClass}}" data-ref="click:onClick" data-bind=text:value></div>',
		
		// placeholder text
		placeholder:'Type here',
		
		// text for Done button
		doneText:'Done',
		
		// Data store (required)
		store:null,
		
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
			value:'TEST'
		},
		
		constructor: function(){
			this.store.on('items', function(items){
				//console.log('store data:\n'+( items.map(function(item){ return item.value; }).join('  \n'))); 
				
				this.onItems(items);
			}, this);
			
			console.log('TEST:', this.value());
		},
		
		onItems: function(items){
			console.log('items:', items.length);
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
				//console.log('    - ', value);
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
				console.log('BLOCK SAME');
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
			console.log(this.inputNode.value);
			var query = {};
			query.name = this.queryName;
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
			console.log('show');
		},
		
		hidePopup: function(){
			dom.hide(this.popupNode);
			this.popupShowing = false;
			this.lastValue = '';
			console.log('hide');
		},
		
		showInput: function(){
			if(!this.containerNode){
				this.buildInput();
			}
			this.node.classList.add('disabled');
			this.inputNode.value = this.value();
			this.inputShowing = true;
			window.requestAnimationFrame(function(){
				this.containerNode.classList.add('show');	
			}.bind(this));
		},
		
		hideInput: function(){
			this.containerNode.classList.remove('show');
			this.node.classList.remove('disabled');
			this.inputShowing = false;
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
			this.inputNode = dom('input', {css:this.inputClass, attr:{placeholder:this.placeholder}}, this.containerNode);
			this.doneBtn = dom('button', {css:this.buttonClass, html:this.doneText}, this.containerNode);
			this.on(this.inputNode, 'keydown', this.onKey, this);
			this.on(this.doneBtn, 'click', function(){
				this.onEnter(this.inputNode.value);	
			}, this);
		},
		
		onClick: function(e){
			console.log('focus');
			this.showInput();
		},
		
		onKeyup: function(e){
			console.log('key', e);
			console.log('value', this.node.value);
		}
	});
});