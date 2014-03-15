define([
	'base/core/dom'
], function(dom){

    return {
		suiteName: 'dom',
		tests:[
			{
				title:'create a node',
				run: function(t){
                    var
                        node = dom('div');
                    t.assert(!!node, 'node exists');
                }
			},{
				title:'create a node with css',
				run: function(t){
                    var
                        value = 'MyClassName',
                        node = dom('div', {css:value});
                    t.assert(node.className === value, 'node.className = ' + value);
                }
			},{
				title:'create a node with style',
				run: function(t){
                    var
                        value = 'red',
                        node = dom('div', {style:{color:value}});
                    t.assert(node.style.color === value, 'node.style.color = ' + value);
                }
			},{
				title:'create a node with an id',
				run: function(t){
                    var
                        value = 'MyId',
                        node = dom('div', {attr:{id:value}});
                    t.assert(node.id === value, 'node.id = ' + value);
                    t.assert(node.getAttribute('id') === value, 'node.getAttribute(id) = ' + value);
                }
			},
        ]
    };

	var testName = 'dom';
	
	return function(options){
		options.begin(testName);
		
		var node = dom('div', {css:'test', html:'test', style:{color:'#fff'}, attr:{id:'test'}});
		console.log('node:', node);
		
		console.log('get color', dom.style(node, 'color'));
		console.log('get id', dom.attr(node, 'id'));
		console.log('destroy:', dom.destroy(node));
		
		options.end(testName);
	};
});
