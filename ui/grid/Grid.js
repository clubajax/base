define([
	'dcl/dcl',
	'../../core/dom',
	'./List'
], function(dcl, dom, List){

	return dcl(List, {
		declaredClass:'BaseGrid',
		baseClass:'base-grid',
		rowClass:'base-grid-row',
		headerClass:'base-grid-header',
		containerClass:'base-grid-container',
		constructor: function(){
			
		},
		postRender: function(){
			this.renderHeader();	
		},
		
		renderHeader: function(){
			var
				col,
				table = dom('table'),
				thead = table.appendChild(dom('thead'), {}, table),
				tr = thead.appendChild(dom('tr'));
				
			for(col = 0; col < this.columns.length; col++){
				dom('th', {html:this.columns[col].label}, tr);
			}
			
			this.header.innerHTML = '';
			this.header.appendChild(table);
		},
		
		render: function(data){
			console.log('render data', data);
			
			var
				i, col, tr, label, text,
				table = dom('table'),
				tbody = table.appendChild(dom('tbody'), {}, table);
				
			
			for(i = 0; i < data.items.length; i++){
				tr = dom('tr', {css:this.rowClass, attr:{'data-item-index':i}}, tbody);
				for(col = 0; col < this.columns.length; col++){
					label = this.columns[col].label;
					text = data.items[i][label];
					dom('td', {html:text}, tr);
				}	
			}
			this.container.innerHTML = '';
			this.container.appendChild(table);
			this.setColumnWidths();
		},
		
		setColumnWidths: function(){
			var
				i,
				ths = this.header.querySelectorAll('th'),
				tds = this.container.querySelector('tr').querySelectorAll('td');
				
			for(i = 0; i < ths.length; i++){
				dom.style(ths[i], {width:'30%', minWidth:'30%'});
				dom.style(tds[i], {width:'30%', minWidth:'30%'});
			}
			
		}
	});
});