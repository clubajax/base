define([
	'dcl/dcl',
	'../../core/dom',
	'../../core/Widget'
], function(dcl, dom, Widget){

	var
		List,
		events = {
			rowClick:'row-click'
		};
		
	List = dcl(Widget, {
		declaredClass:'BaseList',
		
		store:null,
		
		columns:null,
		
		observables:{
			title:'NOTSET'
		},
		
		baseClass:'base-list',
		rowClass:'base-list-row',
		headerClass:'base-list-header',
		containerClass:'base-list-container',
		
		template:'<div class="{{baseClass}}"><div data-ref="header" class="{{headerClass}}"></div><div data-ref="container" class="{{containerClass}}"></div></div>',
		
		rowTemplate:'<div class="base-list-pair"><div class="base-list-label">{LABEL}</div><div class="base-list-text">{TEXT}</div></div>',
		
		constructor: function(){
			this.setStore(this.store);
		},
		
		postRender: function(){
			this.connectClickEvents();
			
			this.title.sub(function(value){
				this.header.innerHTML = value;
			}, this);
			this.title.pub();
		},
		
		setStore: function(store){
			if(this.storeHandle){
				this.storeHandle.remove();
			}
			this.store = store;
			if(this.store){
				this.storeHandle = this.store.on('data', function(data){
					console.log('LIST DATA', data);
					this.render(data);
				}, this);
			}
		},
		render: function(data){
			var i, col, row, html, label, text;
			this.container.innerHTML = '';
			for(i = 0; i < data.items.length; i++){
				row = dom('div', {css:this.rowClass, attr:{'data-item-index':i}});
				for(col = 0; col < this.columns.length; col++){
					label = this.columns[col].label;
					text = data.items[i][label];
					html = this.rowTemplate.replace('{LABEL}', label).replace('{TEXT}', text);
					row.innerHTML += html;
				}
				this.container.appendChild(row);
			}
		},
		connectClickEvents: function(){
			this.on(this.container, 'click .' + this.rowClass, function(event){
				if(this.store){
					event.item = this.store.byIndex(event.selectorElement.getAttribute('data-item-index'));
					if(this.selectedRow){
						this.selectedRow.classList.remove('selected');
					}
				}
				this.selectedRow = event.selectorElement;
				this.selectedRow.classList.add('selected');
				this.emit(events.rowClick, event);
			}, this);
		},
		query: function(){
			this.store.query.apply(this, arguments);
		}
	});
	
	List.events = events;
	
	return List;
});