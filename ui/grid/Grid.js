define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/has',
	'./List'
], function(dcl, dom, has, List){

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
			
			this.connectScrollEvents(table);
			
		},
		
		connectScrollEvents: function(table){
			var
				container = this.container,
				header = this.header,
				useTransform = /Android/.test(navigator.userAgent),
				scroll = useTransform ? function(e){
					// Android does not support node.scrollLeft. How IE6-like of them.
					dom.style(header, has('transform'), 'translateX('+(-container.scrollLeft)+'px)');	
				} : function(e){
					// For sane browsers and devices
					header.scrollLeft = container.scrollLeft;
				};
				
			if(useTransform){
				dom.style(header, 'overflow', 'visible');
			}
			if(this.onScrollHandle){
				this.onScrollHandle.remove();
			}
			this.onScrollHandle = this.on(container, 'scroll', scroll);
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