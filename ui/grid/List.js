define([
	'../../core/dcl',
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
		
		useHeader: false,
		
		baseClass:'base-list',
		rowClass:'base-list-row',
		headerClass:'base-list-header',
		containerClass:'base-list-container',
		scrollerClass:'base-list-scroller',
		
		template:'<div class="{{baseClass}}"><div data-ref="container" class="{{containerClass}}"><div data-ref="scroller" class="{{scrollerClass}}"></div></div></div>',
		
		rowLabelValueTemplate:'<div class="base-list-pair"><div class="base-list-label">{LABEL}</div><div class="base-list-text">{TEXT}</div></div>',
		rowLabelTemplate:'<div class="base-list-pair"><div class="base-list-label">{LABEL}</div></div>',
		rowValueTemplate:'<div class="base-list-pair"><div class="base-list-text">{TEXT}</div></div>',
		
		constructor: function(){
			this.setStore(this.store);
		},
		
		postRender: function(){
			this.connectClickEvents();
		},
		
		setStore: function(store){
			if(this.storeHandle){
				this.storeHandle.remove();
			}
			this.store = store;
			if(this.store){
				this.storeHandle = this.store.on('data', function(data){
					//console.log('LIST DATA', data);
					this.render(data);
				}, this);
			}
		},
		render: function(data, columns){
			var i, col, row, html, label, text, key,
			template = this.useHeader ? this.rowValueTemplate : this.rowLabelValueTemplate,
			node = this.container;
			node.innerHTML = '';
			if(columns){
				this.columns = columns;
			}
			this.renderHeader(data);
			for(i = 0; i < data.items.length; i++){
				row = dom('div', {css:this.rowClass, attr:{'data-item-index':i}});
				
				for(col = 0; col < this.columns.length; col++){
					label = this.columns[col].label;
					key = this.columns[col].key || label;
					text = data.items[i][key];
					html = template.replace('{LABEL}', label).replace('{TEXT}', text);
					row.innerHTML += html;
				}
				node.appendChild(row);
			}
		},
		
		renderHeader: function(){
			if(!this.useHeader){ return; }
			var col, label, template = this.rowLabelTemplate,
			row = dom('div', {css:this.headerClass});
			for(col = 0; col < this.columns.length; col++){
				label = this.columns[col].label;
				row.innerHTML += template.replace('{LABEL}', label);
			}
			this.node.appendChild(row);
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