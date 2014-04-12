define([
], function(){
	
	function Promise(promises){
		
		var
			i,
			self = this,
			resolved = 0,
			callbacks = [],
			errbacks = [],
			progbacks = [];
		
		this.then = function(callback, errback, progback, context){
			
			var ctx = context;
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
			if(ctx){
				callback = callback.bind(ctx);
			}
			callbacks.push(callback);
			
			
			return this;
		};
		
		this.resolve = function(){
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
			for(i = 0; i < promises.length; i++){
				promises[i].then(resolve, self.reject);
			}
		}
	}
	
	Promise.all = function(promises){
		return new Promise(promises);
	};
	
	return Promise;

});