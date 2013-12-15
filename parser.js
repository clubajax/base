define([
	'./registry',
	'./logger'
], function(registry, logger){
	
	var
		log = logger('PRS', 1),
		REF_ATTR = 'data-ref',
		WIDGET_ATTR = 'data-widget',
		plugins = [],
		count = 0;
		
		function plugin(plug){
			plugins.push(plug);	
		}
		
		function attsToObject(atts){
			var i, a, props = {};
			for(i = 0; i < atts.length; i++){
				a = atts[i];
				props[a.localName] = a.value;
			}
			return props;
		}
		
		function walkDom(parentNode, ATTR, nodes){
			// walks a dom tree from a certaion point, and
			// returns an array of nodes that contain a certain
			// attribute
			// 
			nodes = nodes || [];
			var node = parentNode.firstChild;
			while(node){
				if(node.nodeType === 1){
					//log('----node', node, node.getAttribute(WIDGET_ATTR), WIDGET_ATTR);
					
					if(node.getAttribute(ATTR)){
						nodes.push(node);
						//
						// stop searching child nodes if we hit a widget to parse
						// may not work for non-widgt attrs
						// 
					}else if(node.childNodes.length){
						walkDom(node, ATTR, nodes);
					}
				}
				node = node.nextSibling;
			}
			return nodes;
		}
		
		function parse(parentNode, context){
			count++;
			var
				props,
				type,
				Ctor,
				widget,
				widgets = [],
				widgetNodes,
				dent = count+'  ';
			
			log(dent, 'parse');
			
			parentNode = parentNode || document.body;
			console.log('   parentNode:', parentNode);
			
			widgetNodes = walkDom(parentNode, WIDGET_ATTR);
			
			//console.log('****REFS:', walkDom(parentNode, REF_ATTR));
			
			
			
			log(dent, 'parse complete, widgetNodes:', widgetNodes.length);
			
			widgetNodes.forEach(function(node){
				props = attsToObject(node.attributes);
				log('    props', props );
				type = props[WIDGET_ATTR].replace(/\//g, '.');
				Ctor = registry.getClass(type);
				if(!Ctor){
					console.error('cannot find Ctor:', type);
					return;
				}
				log('make widget', type);
				widget = new Ctor(props, node);
				widgets.push(widget);
			});
			
			if(plugins.length){
				plugins.forEach(function(plug){
					plug(walkDom, parentNode, context);
				});
			}else{
				console.log('no plugins.');
			}
			
			return widgets;
		}
		
	return {
		parse: parse,
		plugin: plugin
	};
});