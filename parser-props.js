define([
	'./parser',
	'./registry',
	'./on'
], function(parser, registry, on){
	
	var
		//WIDGET_ATTR = 'data-widget',
		WIDGET_ID_ATTR = 'widgetId',
		PROP_ATTR = 'data-ref';
	
	
	
	function assign(name, context, object){
		var event, method;
		name.split(',').forEach(function(nm){
			nm = nm.trim();
			if(/:/.test(nm)){
				// event/method
				event = nm.split(':')[0].trim();
				method = nm.split(':')[1].trim();
				if(object instanceof window.Node){
					context.own(context.on(object, event, method, context));
				}else{
					context.own(context.on(event, method, context));
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
			nodes = walkDom(parentNode, PROP_ATTR);
			
		for(i = 0; i < nodes.length; i++){
			propName = nodes[i].getAttribute(PROP_ATTR);
			widgetId = nodes[i].getAttribute(WIDGET_ID_ATTR);
			
			if(widgetId){
				assign(propName, context, registry.getWidget(widgetId));
				//context[propName] = registry.getWidget(widgetId);
			}else{
				assign(propName, context, nodes[i]);
				//context[propName] = nodes[i];
			}
			
		}
	});

});