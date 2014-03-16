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
		
		child: function(){
            var tree = new Evented();
            tree.parent = this;
            this.children[tree.id] = {
                tree: tree
                // handle
            };
            return tree;
        },
		
		// this.on(node, 'click', 'doFoo', this)
		
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
