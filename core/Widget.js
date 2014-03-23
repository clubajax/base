define([
	'./dcl',
	'./lang',
	'./dom',
	'./registry',
	'./Base',
	'./parser/main'
], function(dcl, lang, dom, registry, Base, parser){
	
	var Widget = dcl(Base, {
		declaredClass:'Widget',
		template:'<div>NO TEMPLATE</div>',
		constructor: dcl.after(function(args){
			this.children = [];
			
			this.id = args[0] && args[0].id ? args[0].id : dom.uid(this.declaredClass.toLowerCase());
			
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
			
			if(this.nodeIsReference){
				// nodeIsReference means the node is not going to be a parent
				node = null;
			}
			
			if(typeof node === 'string' && document.getElementById(node)){
				node = document.getElementById(node);
			}else if(typeof node === 'string'){
				console.warn('* node not found:', node);
			}
			
			if(typeof this.template === 'object'){
				this.node = dom(this.template.nodeName, this.template);
			}else{
				//console.log('this.template', this.template);
				this.node = dom(this.template.replace(/\{\{[\w\s]*\}\}/g, function(word){
					word = word.substring(2, word.length-2);
					return this[word];
				}.bind(this)));
				
				// causes a recursion in parser test
				// attempting to parse a widget's properties
				// might need a parsed attr, to skip widgets and
				// just check attrs and bindings
				//
               // this.node.setAttribute('parsed', true);
				this.parseChildNodes(this.node, this);
			}
			
				
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
							this.parseChildNodes(childNode);
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
					this.parseChildNodes(appendedNodes);
					this.parsedChildNodes = appendedNodes;
				}
			}else if(this.postCreate){
				this.postCreate();
			}
			
			if(!this.id){
				this.id = lang.uid('widget');
			}
			// noop after creation
			this.renderWidget = function(){};
		
		},
		
		getChildbyNode: function(node){
			var i;
			if(node && node.id && registry.getWidget(node.id)){
				return registry.getWidget(node.id);
			}
			for(i = 0; i < this.children.length; i++){
				if(this.children[i].node === node){
					return this.children[i];
				}
			}
			
			return null;
		},
		
		parseChildNodes: function(nodes, context){
			var widgets = parser.parse(nodes, context);
			this.children = this.children.concat(widgets);
			return widgets;
		}
	});
	
	return Widget;
});
