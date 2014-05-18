	define([
	'./dcl',
	'./on',
	'./EventTree',
	'./observable'
	], function(dcl, on, EventTree, observable){
	
	// Base is a subclass that mixes in an EventTree child instance
	// so that events can be handled as if they are native to the inheriting
	// class
	//
	
	function noop(){}
	
	return dcl(null, {
		declaredClass:'Base',
		constructor: function(options){
			var
				_oldDispose,
				_dispose,
				prop,
				observables = this.observables || {},
				properties = this.properties || {};
			
			options = options || {};
			
			for(prop in options){
				if(options.hasOwnProperty(prop)){
					if(observables[prop]){
						this[prop] = observable(observables[prop]);
					}else if(this[prop] !== undefined){
						this[prop] = options[prop];
					}
				}
			}
			
			for(prop in observables){
				if(observables.hasOwnProperty(prop)){
					if(!this[prop]){
						this[prop] = observable(observables[prop]);
					}	
				}
			}
			
			for(prop in properties){
				if(properties.hasOwnProperty(prop)){
					Object.defineProperty(this, prop, {
						get: properties[prop].get,
						set: properties[prop].set
					});
				}
			}
			
			this.eventTree = options.eventTree || new EventTree(options);
			this.on = function(){
				return this.eventTree.on.apply(this.eventTree, arguments);
			};
			
			this.once = function(){
				return this.eventTree.once.apply(this.eventTree, arguments);
			};
	
			this.emit = function(){
				this.eventTree.emit.apply(this.eventTree, arguments);
			};
			
			this.own = function(handle){
				this.eventTree.addHandle(handle);
			};
			
			this.child = function(){
				return this.eventTree.child();
			};
	
			_dispose = function(){
				if(this.eventTree){
					this.eventTree.dispose();
				}
				this.eventTree = null;
				this.emit = noop;
				this.on = noop;
				this.child = noop;
				this.dispose = noop;
			}.bind(this);
	
			if(this.dispose){
				_oldDispose = this.dispose.bind(this);
				this.dispose = function(){
					_oldDispose();
					_dispose();
				};
			}else{
				this.dispose = _dispose;
			}
		}
	});
	});