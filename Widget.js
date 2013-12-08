define([
	'dcl/dcl',
	'./dom',
	'./parser',
	'./Base'
], function(dcl, dom, parser, Base){
	

	//for(k in dcl){
	//	console.log('   ', k, dcl[k]);
	//}

	
	var Widget = dcl(Base, {
		declaredClass:'Widget',
		template:'<div>NO TEMPLATE</div>',
		constructor: dcl.after(function(args){
			this.render(args[1]);
			if(this.postRender){
				this.postRender();
			}
		}),
		render: function(node){
			console.log('render!', node);
			node = typeof node === 'string' ? document.getElementById(node) : node;
			
			if(node){
				this.node = dom(this.template);
				parser.parse(this.node);
				node.parentNode.replaceChild(this.node, node);
				// noop after creation
				this.render = function(){};
			}
		}
	});
	
	return Widget;
});