define([
], function(){
	
	function Promise(promises){
		// TODO: rename to Deferred. This is not a Promise.
		var
			i,
			self = this,
			resolved = 0,
			callbacks = [],
			errbacks = [],
			progbacks = [];
			
		this.status = 'initialized';
		
		this.then = function(callback, errback, progback, context){
			var ctx = context;
			if(ctx){
				callback = callback.bind(ctx);
			}
			
			if(this.status === 'resolved'){
				callback();
				return this;
			}
			this.status = 'pending';	
			if(progback){
				if(typeof progback === 'object'){
					ctx = progback;
				}else{
					progbacks.push(progback);
				}
			}
			if(errback){
				if(typeof errback === 'object'){
					ctx = errback;
				}else{
					errbacks.push(errback);
				}
			}
			callbacks.push(callback);
			
			
			return this;
		};
		
		this.resolve = function(){
			this.status = 'resolved';
			for(i = 0; i < callbacks.length; i++){
				callbacks[i].apply(null, arguments);
			}
			return this;
		};
		
		this.call = function(){
			var args = Array.prototype.splice.call(arguments, 0);
			setTimeout(function(){
				this.resolve.apply(this, args);	
			}.bind(this), 1);
		};
		
		this.reject = function(){
			for(i = 0; i < errbacks.length; i++){
				errbacks[i].apply(null, arguments);
			}
			return this;
		};
		
		this.abort = function(){
			
		};
		
		this.inject = function(object){
			// promise-ify's an object
			// adding then()
			// (what else? status?)
			object.then = this.then;
		};
		
		
		//
		// handle Promise.all
		// 
		function resolve(){
			resolved++;
			if(resolved === promises.length){
				self.resolve();
			}
		}
		
		if(promises){
			if(promises.every(function(p){ return p.state === 'resolved'; })){
				resolve();
			}else{
				for(i = 0; i < promises.length; i++){
					promises[i].then(resolve, self.reject);
				}
			}
		}
	}
	
	Promise.all = function(promises){
		return new Promise(promises);
	};
	
	return Promise;

});