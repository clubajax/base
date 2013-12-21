define([
	'dcl/dcl',
	'../core/dom',
	'../core/Widget'
], function(dcl, dom, Widget){

	return dcl(Widget, {
		declaredClass:'List',
		
		store:null,
		
		columns:null,
		
		observables:{
			title:'NOTSET'
		},
		
		template:'<div class="base-list"><div data-ref="header" data-bind="text:title" class="base-list-header"></div><div data-ref="container" class="base-list-container"></div></div>',
		
		rowTemplate:'<div class="base-list-pair"><div class="base-list-label">{LABEL}</div><div class="base-list-text">{TEXT}</div></div>',
		
		constructor: function(){
			this.setStore(this.store);
		},
		setStore: function(store){
			if(this.storeHandle){
				this.storeHandle.remove();
			}
			this.store = store;
			this.storeHandle = this.store.on('data', function(data){
				console.log('LIST DATA', data);
				this.renderList(data);
			}, this);
		},
		renderList: function(data){
			var i, col, row, html, label, text;
			this.container.innerHTML = '';
			for(i = 0; i < data.items.length; i++){
				console.log('ROW');
				row = dom('div', {css:'base-list-row'});
				for(col = 0; col < this.columns.length; col++){
					label = this.columns[col].label;
					text = data.items[i][label];
					console.log('', label, text);
					html = this.rowTemplate.replace('{LABEL}', label).replace('{TEXT}', text);
					
					row.innerHTML += html;
				}
				this.container.appendChild(row);
			}
		},
		query: function(){
			this.store.query.apply(this, arguments);
		}
	});
});