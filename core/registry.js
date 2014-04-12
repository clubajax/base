define([], function(){
	
	// working around a strange dojo loader bug, which loads this file twice
	// 
	if(window.base_registry){
		return window.base_registry;
	}
	var
		classes = {},
		widgets = {},
		stores = {},
		callbacks = {},
		registry = {
			classes:classes,
			widgets: widgets,
			stores: stores,
			addClass: function(name, Class){
				classes[name] = Class;
			},
			getClass: function(name){
				return classes[name];
			},
			addWidget: function(id, widget){
				widgets[id] = widget;
			},
			getWidget: function(id){
				return widgets[id];
			},
			setStore: function(store){
				stores[store.id] = store;
				if(callbacks[store.id]){
					callbacks[store.id](store);
				}
			},
			getStore: function(id, callback){
				var store = stores[id];
				if(callback){
					if(store){
						callback(store);
					}else{
						callbacks[id] = callback;
					}
				}
				return store;
			},
			log: function(what){
				// for testin'
				var names;
				if(what === 'classes'){
					console.log('classes', classes);
				}else if(what === 'className'){
					names = [];
					Object.keys(classes).forEach(function(name){ names.push(name); });
					console.log('classNames:', names.join(', '));
				}
			}
		};
	
	window.base_registry = registry;
	return registry;
});