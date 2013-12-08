define([
	'./registry',
	'./logger'
], function(registry, logger){
	var
		log = logger('PRS', 1),
		WIDGET_ATTR = 'data-widget',
		indent = '',
		
		count = 0,
		
		attsToObject = function(atts){
			var props = {};
			for(var i=0; i<atts.length; i++){
				var a = atts[i];
				props[a.localName] = a.value;
			}
			return props;
		},
		
		walkDom = function(parentNode, viewNodes){
			viewNodes = viewNodes || [];
			var node = parentNode.firstChild;
			while(node){
				if(node.nodeType === 1){
					//log('----node', node, node.getAttribute(WIDGET_ATTR), WIDGET_ATTR);
					if(node.getAttribute(WIDGET_ATTR)){
						viewNodes.push(node);
					}else if(node.childNodes.length){
						walkDom(node, viewNodes);
					}
				}
				node = node.nextSibling;
			}
			return viewNodes;
		},
		
		parse = function(parentNode){
			count++;
			var dent = count+'  ';
			log(dent, 'parse');
			
			parentNode = parentNode || document.body;
			console.log('   parentNode:', parentNode);
			var viewNodes = walkDom(parentNode);
			if(viewNodes.length){
				log(dent, 'parse complete');
			}else{
				log('parse nodes', viewNodes);
			}
			
			var widgets = [];
			viewNodes.forEach(function(node){
				var props = attsToObject(node.attributes);
				log('    props', props );
				var type = props[WIDGET_ATTR].replace(/\//g, '.');
				var ctor = registry.getClass(type);
				if(!ctor){
					console.error('cannot find ctor:', type);
					return;
				}
				log('make view', type);
				var view = new ctor(props, node);
				widgets.push(view);
			});
			
			
			return widgets;
		}
		
	return {
		parse:parse
	};
});