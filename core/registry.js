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
		}
	};
});