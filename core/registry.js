define([], function(){

	var
		classes = {},
		widgets = {};
		
	return {
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
});