define([
	'./Promise'
], function(Promise){
	
	function toQuery(obj){
		var key, i, params = [];
		for(key in obj){
			if(obj.hasOwnProperty(key)){
				if(Array.isArray(obj[key])){
					for(i = 0; i < obj[key].length; i++){
						params.push(key+'='+obj[key][i]);
					}
				}else{
					params.push(key+'='+obj[key]);
				}
			}
		}
		return params.join('&');
	}
	
	function xhr(url, options){
		options = options || {};
		options.type = options.type || 'GET';
		var
			promise = new Promise(),
			req = new XMLHttpRequest(),
			handleAs = options.handleAs || 'json';
		
		if(options.params){
			url += '?' + toQuery(options.params);
		}
		
		
		function callback(result){
			if(options.callback){
				options.callback(result);
			}
			promise.resolve(result);
		}
		
		function errback(err){
			console.error('XHR ERROR:', err);
			if(options.errback){
				options.errback(err);
			}
			promise.reject(err);
		}
		
		function onload(request) {
			var req = request.currentTarget, result, err;
	
			if(req.status !== 200){
				err = {
					status: req.status,
					message: req.statusText,
					request:req
				};
				errback(err);
			}
			else {
				if(handleAs === 'json'){
					try{
						result = JSON.parse(req.responseText);
					}catch(e){
						console.error('XHR PARSE ERROR:', req.responseText);
						errback(e);
						// return?
					}
				}
				setTimeout(function(){
					callback(result || req.responseText);
				}, 1);
			}
		}
		
		req.onload = onload;
		req.open(options.type, url, true);
		
		if(handleAs === 'json'){
			req.setRequestHeader('Accept', 'application/json');
		}
		
		req.send();
		
		promise.request = promise.req = req;
		return promise;
	}
	
	function get(url, options){
		return xhr(url, options);
	}
	
	function post(url, options){
		options = options || {};
		options.type = 'POST';
		return xhr(url, options);
	}
	
	xhr.get = get;
	xhr.post = post;
	xhr.toQuery = toQuery;
	return xhr;
});