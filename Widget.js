define([
	'dcl/dcl',
	'./lang',
	'./dom',
	'./registry',
	'./Base',
	'./parser',
	'./parser-props',
], function(dcl, lang, dom, registry, Base, parser){
	
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
			var attrObject;
			
			console.log('render!', node);
			node = typeof node === 'string' ? document.getElementById(node) : node;
			
			if(node){
				attrObject = dom.attr(node);
				if(attrObject.id){
					attrObject.widgetId = attrObject.id;
				}else{
					attrObject.widgetId = lang.uid('widget');
				}
				registry.addWidget(attrObject.widgetId, this);
				
				this.node = dom(this.template);
				parser.parse(this.node, this);
				node.parentNode.replaceChild(this.node, node);
				
				dom.attr(this.node, attrObject);
				
				
				// noop after creation
				this.render = function(){};
			}
		}
	});
	
	return Widget;
});