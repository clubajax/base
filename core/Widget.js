define([
	'dcl/dcl',
	'./lang',
	'./dom',
	'./registry',
	'./Base',
	'./parser',
	'./parser-reference',
	'./parser-observable',
	'./parser-attributes'
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
			var
				childNode,
				childrenNode,
				appendedNodes = [],
				attrObject;
			
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
				
				childrenNode = this.containerNode || this.container || this.node;
				
				while(node.firstChild){
					// TODO: Include comments and white space?
					// TODO: If frag just contains text, this may be used for
					// things like button labels or input values
					childNode = node.firstChild;
					if(childNode.nodeType === 1){
						if(this.appendNode){
							this.appendNode.appendChild(childNode);
							appendedNodes.push(childNode);
						}else{
							childrenNode.appendChild(childNode);
							parser.parse(childNode);
						}
					}else{
						// to keep the while() moving
						node.removeChild(childNode);
					}
				}
				
				dom.attr(this.node, attrObject);
				
				if(this.postCreate){
					this.postCreate();
				}
				
				if(node.parentNode){
					node.parentNode.replaceChild(this.node, node);
				}
				
				if(appendedNodes.length){
					parser.parse(appendedNodes);
					this.parsedChildNodes = appendedNodes;
					console.log('this.parsedChildNodes', this.parsedChildNodes);
				}
			}else if(this.postCreate){
				this.postCreate();
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