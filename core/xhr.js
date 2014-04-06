define([
], function(dcl){
	
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
		
		var
			req = new XMLHttpRequest(),
			handleAs = options.handleAs || 'json';
		
		if(options.params){
			url += '?' + toQuery(options.params);
		}
		
		function onload(request) {
			var req = request.currentTarget, result, err;
			//console.log(this.responseText);
			//console.log('onload', req);
			
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
						console.error('XHR PARSE ERROR:', req.responseText);
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
				}else{
					setTimeout(function(){
						options.callback(req.responseText);
					}, 1);	
				}
			}
		}
		
		req.onload = onload;
		if(options.proxy){
			req.open(options.type, './proxy.php?url='+window.escape(url), true);
		}else{
			req.open(options.type, url, true);
		}
		req.send();
		return req;
	}
	
	function get(url, options){
		options = options || {};
		options.type = 'GET';
		return xhr(url, options);
	}
	
	function post(url, options){
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