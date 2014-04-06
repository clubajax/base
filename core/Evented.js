define([
	'./dcl',
	'./lang',
	'./on'
], function(dcl, lang, on){

	function noop(){}
	
	var Evented = dcl(null, {
		
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
					if(listeners.hasOwnProperty(key) && listeners[key]){
						// key may still exist, since handle is being held
						// by another party
						listeners[key].apply(null, args);
					}
				}
			}
			
		},
		
		removeAll: function(){
			this.listeners = {};
		},
		
		child: function(){
            var tree = new Evented();
            tree.parent = this;
            this.children[tree.id] = {
                tree: tree
                // handle
            };
            return tree;
        },
		
		on: function(name, callback, context){
			var
				listeners = this.listeners,
				paused,
				handle,
				id = lang.uid();
			if(name instanceof window.Node){
				handle = on.apply(null, arguments);
				// need to collect and destroy
				return handle;
			}
			
			this.listeners[name] = this.listeners[name] || {};
			if(context){
				callback = callback.bind(context);
			}
			
			listeners[name][id] = callback;
			
			return {
				remove: function(){
					console.log('REMOVE', id);
					listeners[name][id] = noop;
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
	
	return Evented;
});
