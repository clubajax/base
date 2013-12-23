define([
	'dcl/dcl',
	'../../core/dom',
	'./List'
], function(dcl, dom, List){

	var scrollbarwidth;
	function getScrollbarWidth(header, container){
		if(!scrollbarwidth){
			header.scrollLeft = 10000;
			container.scrollLeft = 10000;
			scrollbarwidth = container.scrollLeft - header.scrollLeft;
		}
		return scrollbarwidth;
	}
	
	return dcl(List, {
		declaredClass:'BaseGrid',
		baseClass:'base-grid',
		rowClass:'base-grid-row',
		headerClass:'base-grid-header',
		containerClass:'base-grid-container',
		constructor: function(){
			
		},
		postRender: function(){
			this.connectClickEvents();
			this.connectScrollEvents();
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
		
		connectScrollEvents: function(){
			var
				container = this.container,
				header = this.header;
				window.header = header; window.container = container;
			this.on(container, 'scroll', function(e){
				header.scrollLeft = container.scrollLeft;
			});
		},
		
		setColumnWidths: function(){
			var
				i, max,
				container = this.container,
				header = this.header,
				headerTable = header.querySelector('table'),
				ths = headerTable.querySelectorAll('th'),
				lastTH = ths[ths.length - 1],
				containerTable = container.querySelector('table'),
				tds = containerTable.querySelector('tr').querySelectorAll('td');
			
			// reset
			dom.style(lastTH, 'paddingRight', '');
			dom.style(header, {
				position:'absolute',
				width:10000
			});
			dom.style(container, {
				position:'absolute',
				width:10000
			});
			for(i = 0; i < ths.length; i++){
				dom.style(ths[i], {width:'', minWidth:''});
				dom.style(tds[i], {width:'', minWidth:''});
			}
			
			window.requestAnimationFrame(function(){
				for(i = 0; i < ths.length; i++){
					max = Math.max(dom.box(ths[i]).width, dom.box(tds[i]).width);
					dom.style(ths[i], {width:max, minWidth:max});
					dom.style(tds[i], {width:max, minWidth:max});
				}	
				dom.style(header, {
					position:'',
					width:''
				});
				dom.style(container, {
					position:'',
					width:''
				});
				
				//sw = getScrollbarWidth(header, container);
				dom.style(lastTH, 'paddingRight', 20+'px');
			});
			
		}
	});
});