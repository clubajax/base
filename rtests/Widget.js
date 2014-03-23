define([
	'base/core/dom',
	'base/core/Widget'
], function(dom, Widget){

    return {
		suiteName: 'Widget',
		tests:[
			{
				title:'create a node',
				run: function(t){
                    var
                        node = dom('div');
                    t.assert(!!node, 'node exists');
                }
			}
        ]
    };
});
