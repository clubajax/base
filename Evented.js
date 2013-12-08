define([
	'dcl/dcl',
	'./lang'
], function(dcl, lang){

	function noop(){}
	
	return dcl(null, {
		
		declaredClass:'',
		
		constructor: function(){
			this.listeners = {};
		},
		
		emit: function(name){
			var
				key,
				listeners = this.listeners[name],
				args = Array.prototype.slice.call(arguments);
			args.shift();
			
			if(listeners){
				for(key in listeners){
					if(listeners.hasOwnProperty(key)){
						listeners[key].apply(null, args);
					}
				}
			}
			
		},
		
		removeAll: function(){
			this.listeners = {};
		},
		
		on: function(name, callback, context){
			this.listeners[name] = this.listeners[name] || {};
			if(context){
				callback = callback.bind(context);
			}
			
			var
				listeners = this.listeners,
				paused,
				id = lang.uid();
			
			listeners[name][id] = callback;
			
			return {
				remove: function(){
					delete listeners[name][id];
				},
				pause: function(){
					paused = listeners[name][id];
					listeners[name][id] = noop;
				},
				resume: function(){
					listeners[name][id] = paused;
				}
			}
		}
	});
});