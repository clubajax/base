define([
	'base/core/dom',
	'base/ui/grid/Tree'
], function(dom, Tree){
	
	var data01 = {
		"folders": [{
			"name": "World",
			"id": "1",
			"folders": [{
				"name": "United States",
				"id": "4",
				"files": [{
					"name": "Texas",
					"id": "5"
				}]
			}]
		}],
		"files": [{
			"name": "Mars",
			"id": "2"
		},{
			"name": "Venus",
			"id": "3"
		}]
	};
	
    return {
		suiteName: 'Tree basic',
		tests:[
			{
				title:'create a Tree',
				run: function(t){
					var w;
			
					w = new Tree();
					t.assert(!!w, 'empty Tree widget, no args doesn\'t blow up');
					
				}
			},{
				title:'create a Tree with node',
				run: function(t){
					document.body.innerHTML = "<div><div id='widget'></div></div>";
					
					var w;
			
					w = new Tree({}, 'widget');
					t.assert(!!w, 'empty Tree widget, attached to DOM');
					t.assert(!!w.node, 'has node');
					
				}
			},{
				title:'create a Tree append to dom',
				run: function(t){
					document.body.innerHTML = "<div><div id='widget'></div></div>";
					
					var w;
			
					w = new Tree({});
					dom.byId('widget').appendChild(w.node);
					t.assert(!!w, 'empty Tree widget, appended to DOM');
					t.assert(!!w.node, 'has node');
					
				}
			},{
				title:'create a Tree with data',
				run: function(t){
					document.body.innerHTML = "<div><div id='widget'></div></div>";
					
					var w;
			
					w = new Tree({}, 'widget');
					w.render(data01);
					
					t.assert(!!w, 'Tree widget with data, attached to DOM');
					t.assert(!!w.node, 'has node');
					t.assert(!!w.containerNode, 'has containerNode');
					t.assert(w.containerNode.children.length === 3, 'containerNode has 3 children');
					t.assert(w.items.length === 5, 'tree has 5 items');
					//w.node.log();
					
				}
			}
		]
	};
});