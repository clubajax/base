define([
	'./parser',
	'../registry',
	'../on'
], function(parser, registry, on){
	
	var
		//WIDGET_ATTR = 'data-widget',
		WIDGET_ID_ATTR = 'widgetId',
		REF_ATTR = 'data-ref';
	
	function assign(name, context, object){
		var event, method;
		name.split(',').forEach(function(nm){
			nm = nm.trim();
			if(/:/.test(nm)){
				// event/method
				event = nm.split(':')[0].trim();
				method = nm.split(':')[1].trim();
				if(!context[method]){
					console.error('parser: Method "'+method+'" missing from widget:', context);
				}
				if(object instanceof window.Node){
					context.own(context.on(object, event, context[method], context));
				}else{
					context.own(object.on(event, context[method], context));
				}
			}else{
				// prop assignment
				context[nm] = object;
			}
		});
	}
	
	parser.plugin(function(walkDom, parentNode, context){
		if(!context){
			return;
		}
		
		var
			i,
			propName,
			widgetId,
			nodes = walkDom(parentNode, REF_ATTR);
		
		if(parentNode.getAttribute(REF_ATTR)){
			nodes.push(parentNode);
		}
		for(i = 0; i < nodes.length; i++){
			propName = nodes[i].getAttribute(REF_ATTR);
			widgetId = nodes[i].getAttribute(WIDGET_ID_ATTR);
			
			if(widgetId){
				assign(propName, context, registry.getWidget(widgetId));
			}else{
				assign(propName, context, nodes[i]);
			}
			
		}
	});

});