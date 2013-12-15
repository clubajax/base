define([
], function(dcl){
	
	function toQuery(obj){
		var key, params = [];
		for(key in obj){
			if(obj.hasOwnProperty(key)){
				params.push(key+'='+obj[key]);
			}
		}
		return params.join('&');
	}
	
	function xhr(url, options){
		
		var
			req = new XMLHttpRequest(),
			handleAs = options.handleAs || 'json';
		
		if(options.params){
			url += '?' + toQuery(options.params);
		}
		
		function onload(request) {
			var req = request.currentTarget;
			//console.log(this.responseText);
			console.log('onload', req);
			var result, err;
			
			if(req.status !== 200){
				err = {
					status: req.status,
					message: req.statusText,
					request:req
				};
				if(options.errback){
					options.errback(err);
				}else{
					console.error('XHR ERROR:', err);
				}
			}
			
			if(options.callback){
				if(handleAs === 'json'){
					try{
						result = JSON.parse(req.responseText);
					}catch(e){
						if(options.errback){
							options.errback(e);
						}else{
							console.error('XHR ERROR:');
							console.dir(e);
						}
						return;
					}
				}
				if(result){
					setTimeout(function(){
						options.callback(result);
					}, 1);
				}
			}
		}
		
		req.onload = onload;
		req.open(options.type, url, true);
		req.send();
		return req;
	}
	
	function get(url, options){
		options = options || {};
		options.type = 'GET';
		return xhr(url, options);
	}
	
	function post(options){
		options = options || {};
		options.type = 'POST';
		return xhr(url, options);
	}
	
	return {
		get:get,
		post: post,
		toQuery:toQuery
	};
});