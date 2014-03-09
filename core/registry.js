define([], function(){
	
	// working around a strange dojo loader bug, which loads this file twice
	// 
	if(window.base_registry){
		return window.base_registry;
	}
	var
		classes = {},
		widgets = {},
		registry = {
			classes:classes,
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