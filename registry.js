define([], function(){

	var classes = {};
	return {
		addClass: function(name, Class){
			classes[name] = Class;	
		},
		getClass: function(name){
			return classes[name];
		}
	};
});