define([
	'base/core/xhr',
	'base/ui/grid/Grid'
], function(xhr, Grid){
	
    return {
		suiteName: 'Widget-declarative',
		tests:[
			{
				skip:'node',
				title:'create a Parent widget',
				run: function(t){
					document.body.innerHTML =	"<div class='wrap'><div id='list'></div></div>";
					
					var grid;
					
					xhr.get('../assets/grid.json', {
						callback: function(data){
							console.log('JSON', data);
							grid.render(data);
						}	
					});
					
					grid = new Grid({
						columns:[{
							label:'reference'
						},{
							label:'name'
						},{
							label:'type'
						},{
							label:'value'
						},{
							label:'timestamp'
						},{
							label:'schema'
						},{
							label:'source'
						}]
					}, 'list');
					
					
					
					
					grid.on('row-click', function(event){
						console.log('clicked item', event.item);
					});
					
					//t.assert(document.body.firstChild.className === 'ParentWidget', "firstChild.className === 'ParentWidget'");
					//t.assert(widget, 'widget01 exists');
					//t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');

				}
			}
		]
	};
});