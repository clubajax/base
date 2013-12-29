define([
	'dcl/dcl',
	'./lang',
	'./dom',
	'./registry',
	'./Base',
	'./parser',
	'./parser-props',
	'./parser-observable'
], function(dcl, lang, dom, registry, Base, parser){
	
	var Widget = dcl(Base, {
		declaredClass:'Widget',
		template:'<div>NO TEMPLATE</div>',
		constructor: dcl.after(function(args){
			
			if(this.preRender){
				this.preRender();
			}
			
			this.renderWidget(args[1]);
			
			// probably don't need this. constructor should work
			if(this.postRender){
				this.postRender();
			}
		}),
		renderWidget: function(node){
			var attrObject;
			
			//console.log('render!', node);
			node = typeof node === 'string' ? document.getElementById(node) : node;
			
			this.node = dom(this.template.replace(/\{\{\w*\}\}/g, function(word){
				word = word.substring(2, word.length-2);
				return this[word];
			}.bind(this)));
			parser.parse(this.node, this);
				
				
			if(node){
				// associated with a dom node to replace
				attrObject = dom.attr(node);
				if(attrObject.id){
					this.id = attrObject.widgetId = attrObject.id;
				}else{
					this.id = attrObject.widgetId = lang.uid('widget');
				}
				registry.addWidget(attrObject.widgetId, this);
				
				node.parentNode.replaceChild(this.node, node);
				
				dom.attr(this.node, attrObject);
			}
			
			if(!this.id){
				this.id = lang.uid('widget');
			}
			// noop after creation
			this.renderWidget = function(){};
		
		}
	});
	
	return Widget;
});