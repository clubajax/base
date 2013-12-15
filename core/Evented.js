define([
	'dcl/dcl',
	'./lang',
	'./on'
], function(dcl, lang, on){

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
			//console.log('dojoConfig', dojoConfig);
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
		
		
		// this.on(node, 'click', 'doFoo', this)
		
		on: function(name, callback, context){
			if(name instanceof window.Node){
				return on.apply(null, arguments);
			}
			
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
			};
		}
	});
});