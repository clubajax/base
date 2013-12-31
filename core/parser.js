define([
	'./registry',
	'./logger'
], function(registry, logger){
	
	var
		log = logger('PRS', 0),
		REF_ATTR = 'data-ref',
		WIDGET_ATTR = 'data-widget',
		PROP_ATTR = 'data-props',
		plugins = [],
		count = 0;
		
		function plugin(plug){
			plugins.push(plug);	
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
		
		function walkDom(parentNode, ATTR, nodes){
			// walks a dom tree from a certain point, and
			// returns an array of nodes that contain a certain
			// attribute
			// 
			nodes = nodes || [];
			var node = parentNode.firstChild;
			while(node){
				if(node.nodeType === 1){
					//log('----node', node, node.getAttribute(WIDGET_ATTR), WIDGET_ATTR);
					//console.log('parse node', node.getAttribute(ATTR));
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
			
			widgetNodes = walkDom(parentNode, WIDGET_ATTR);
			
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
	
	function parseProps(template){
		// pre parse template to get attributes
		
	}
	
	return {
		parseProps: parseProps,
		parse: parse,
		plugin: plugin
	};
});