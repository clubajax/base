define([
	'../registry',
	'../logger'
], function(registry, logger){
	
	var
		log = logger('PRS', 0),
		WIDGET_ATTR = 'data-widget',
		PROP_ATTR = 'data-props',
		plugins = [],
		spaces = '                                                                                   ', 
		count = 0;
		
		function plugin(plug){
			plugins.push(plug);	
		}
		
		function handlePlugins(type, nodeOrAttributes, object){
			if(plugins.length){
				if(type === 'node'){
					
					plugins.forEach(function(plug){
						plug(walkDom, nodeOrAttributes, object);
					});
				
				}else if(type === 'attributes'){
					plugins.forEach(function(plug){
						plug(nodeOrAttributes, object);
					});
				}
			}else{
				console.log('no plugins.');
			}
		}
		
		function assignProps(object, propObject){
			//	currently only supports flat objects
			//	deeper nesting could be done with:
			//		JSON.parse('{' + propObject + '}');
			var
			i, key, value,
			props = propObject.split(',');
		
			for(i = 0; i < props.length; i++){
				key = props[i].split(':')[0].trim();
				value = props[i].split(':')[1].trim();
				if(value !== '' && !isNaN(Number(value))){
					value = Number(value);
				}
				object[key] = value;
			}
		}
		
		function attsToObject(atts){
			var i, a, props = {};
			for(i = 0; i < atts.length; i++){
				a = atts[i];
				if(a.localName === PROP_ATTR){
					assignProps(props, a.value);
				}else{
					props[a.localName] = a.value;
				}
			}
			return props;
		}
		
		function walkDom(parentNode, ATTR, nodes, widgetHasBeenParsed){
			// walks a dom tree from a certain point, and
			// returns an array of nodes that contain a certain
			// attribute
			//
			nodes = nodes || [];
			
			if(!widgetHasBeenParsed && parentNode.getAttribute(ATTR)){
				nodes.push(parentNode);
			}
			
			// I think if !widgetHasBeenParsed I should handle plugins instead
			//
			//
			//
			//
			// 
			
			var node = parentNode.firstChild;
			while(node){
				if(node.nodeType === 1){
					//log('----node', node, node.getAttribute(WIDGET_ATTR), WIDGET_ATTR);
					//console.log('parse node', node.getAttribute(ATTR), 'parsed:', node.getAttribute('parsed'));
					if(node.getAttribute(ATTR)){
						node.setAttribute('parsed', true);
						nodes.push(node);
						//
						// stop searching child nodes if we hit a widget to parse
						// may not work for non-widget attrs
						// 
					}else if(node.children.length){
						//console.log('not widget', node);
						walkDom(node, ATTR, nodes);
					}
				}
				node = node.nextSibling;
			}
			return nodes;
		}
		
		function parse(parentNode, context){
			//console.log(' * parse', count);
			//console.trace('');
			count++;
			
			if(count > 50){
				//console.trace('');
				throw new Error('TOO MUCH RECURSION');
			}
			var
				i,
				props,
				type,
				Ctor,
				widget,
				widgets = [],
				widgetNodes,
				widgetHasBeenParsed,
				dent = spaces.substring(0, count);
			
			if(Array.isArray(parentNode)){
				for(i = 0; i < parentNode.length; i++){
					widgets = widgets.concat(parse(parentNode[i], context));
				}
				return widgets;
			}
			
			log(dent, 'parse');
			
			widgetHasBeenParsed = parentNode && parentNode.getAttribute('parsed');
            
			parentNode = parentNode || document.body;
			
			widgetNodes = walkDom(parentNode, WIDGET_ATTR, null, widgetHasBeenParsed);
			
			log(dent, 'parse complete, widgetNodes:', widgetNodes.length);
			
			widgetNodes.forEach(function(node){
				
				//if(!node.getAttribute(WIDGET_ATTR)){
				//	console.log(' *** already parsed!', node);
				//	return;
				//}
				//if(node.getAttribute('parsed')){
				//	console.log(' *** already parsed!', node);
				//	widget = registry.getWidget(node.getAttribute('widgetId'));
				//	widgets.push(widget);
				//	console.log(' here is proof:', widget);
				//	return;
				//}
				//console.log('node.attributes', node.attributes, node.attributes instanceof window.NamedNodeMap );
				props = {};
				//attsToObject(node.attributes);
				handlePlugins('attributes', node.attributes, props);
				
				log(dent, 'props', props );
				type = props[WIDGET_ATTR].replace(/\//g, '.');
				Ctor = registry.getClass(type);
				if(!Ctor){
					console.error('cannot find Ctor:', type);
					return;
				}
				log(dent, 'make widget', type);
				
				//node.setAttribute('data-parsed', props['data-widget']);
				//node.removeAttribute('data-widget');
				//delete props['data-widget'];
				
				widget = new Ctor(props, node);
				widgets.push(widget);
			});
			
			handlePlugins('node', parentNode, context);
			//log(dent, 'widgets', widgets);
			//if(widgets.length){ console.log('widgets', widgets); }
			return widgets;
		}
	
	function parseProps(template){
		// pre parse template to get attributes
		
	}
	
	return {
		parseProps: parseProps,
		parse: parse,
		plugin: plugin
	};
});
