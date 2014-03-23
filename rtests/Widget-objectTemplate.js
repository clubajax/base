define([
	'base/core/dom',
	'base/core/Widget'
], function(dom, Widget){

    return {
		suiteName: 'Widget-objectTemplate',
		tests:[
			{
				title:'create a widget',
				run: function(t){
					document.body.innerHTML = "<div id='widget01'></div>";
					var
						id = 'test-id',
						w = new Widget({
							template:{
								nodeName:'div',
								css:'test-object',
								html:'Test Object',
								attr:{
									id:id
								},
								style:{
									border:'1px solid #dd0000',
									width:100,
									height:100
								}
							},	
						}, 'widget01');
								
					
					t.assert(!!w, 'widget exists');
					t.assert(!!w.node, 'widget.node exists');
					t.assert(w.node.id = id, 'id = ' + id);
					t.assert(w.node.className = 'test-object', 'className = test-object');
					t.assert(w.node.innerHTML = 'Test Object', 'innerHTML = Test Object');
					t.assert(w.node.style.border = '1px solid #dd0000', 'style.border = 1px solid #dd0000');
				}
			}
        ]
    };
});
