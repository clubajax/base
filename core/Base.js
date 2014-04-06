	define([
	'./dcl',
	'./on',
	'./EventTree'
	], function(dcl, on, EventTree){
	
	// Base is a subclass that mixes in an EventTree child instance
	// so that events can be handled as if they are native to the inheriting
	// class
	//
	
	function noop(){}
	
	return dcl(null, {
		declaredClass:'Base',
		constructor: function(options){
			var _oldDispose, _dispose, prop;
			options = options || {};
			
			for(prop in options){
				if(options.hasOwnProperty(prop)){
					if(this[prop] !== undefined){
						this[prop] = options[prop];
					}
				}
			}
			
			this.tree = options.tree || new EventTree(options);
			this.on = function(){
				return this.tree.on.apply(this.tree, arguments);
			};
	
			this.emit = function(){
				this.tree.emit.apply(this.tree, arguments);
			};
			
			this.own = function(handle){
				this.tree.addHandle(handle);
			};
			
			this.child = function(){
				return this.tree.child();
			};
	
			_dispose = function(){
				if(this.tree){
					this.tree.dispose();
				}
				this.tree = null;
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