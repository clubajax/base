define([
	'./parser',
	'../registry',
	'../observable',
	'../on'
], function(parser, registry, observable, on){
	
	var
		//WIDGET_ATTR = 'data-widget',
		//WIDGET_ID_ATTR = 'widgetId',
		OBS_ATTR = 'data-bind',
		map;
		
	function text(obs, context, node){
		obs.subscribe(function(value){
			node.innerHTML = value;	
		});
		obs.publish();
	}
	
	function css(obs, context, node){
		var currentClassName;
		obs.subscribe(function(value){
			if(currentClassName){
				node.classList.remove(currentClassName);
			}
			currentClassName = value;
			node.classList.add(currentClassName);	
		});
		obs.publish();
	}
	
	map = {
		text:text,
		css:css
	};
	
	function assign(node, context){
		var
			i,
			obs,
			key,
			value,
			keyValues = node.getAttribute(OBS_ATTR).split(',');
			
		for(i = 0; i < keyValues.length; i++){
			key = keyValues[i].split(':')[0].trim();
			value = keyValues[i].split(':')[1].trim();
			
			obs = context[value];
			if(!observable.isObservable(obs)){
				console.error('parser: attached item "'+value+'"is not an observable in', context);
				return;
			}
			
			map[key](obs, context, node);
		}
	}
	
	parser.plugin(function(walkDom, parentNode, context){
		if(!context){
			return;
		}
		
		var
			i,
			nodes = walkDom(parentNode, OBS_ATTR);
		
		if(parentNode.getAttribute(OBS_ATTR)){
			nodes.push(parentNode);
		}
		for(i = 0; i < nodes.length; i++){
			assign(nodes[i], context);
		}
	});

});