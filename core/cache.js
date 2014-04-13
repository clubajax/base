define([
	'./storage',
	'./xhr',
	'./Promise'
], function(storage, xhr, Promise){
	
	function parseExpiration(object){
		var
			expires = object.expires,
			timestamp = object.timestamp,
			interval = parseInt(expires, 10),
			unit = expires.replace(/\d+\s*/, '').toLowerCase();
			
		unit = /sec|min|hour|day/.exec(unit);
		if(unit && unit.length){
			unit = unit[0];
		}
		
		return {
			date: new Date(timestamp),
			unit: unit,
			interval: interval
		};
	}
	
	function expired(object){
		console.log('expired?');
		if(!object.expires){
			console.log('!object.expires');
			return false;
		}
		var
			info = parseExpiration(object),
			now = new Date();
			
		console.log('info', info);
		
		switch(info.unit){
			case 'sec':
				info.date.setSeconds(info.date.getSeconds() + info.interval);
				break;
			case 'min':
				info.date.setMinutes(info.date.getMinutes() + info.interval);
				break;
			case 'hour':
				info.date.setHours(info.date.getHours() + info.interval);
				break;
			case 'day':
				info.date.setDate(info.date.getDate() + info.interval);
				break;
		}
		console.log('comp', now, info.date);
		return now.getTime() > info.date.getTime();
	}
	
	function load(url, promise, expires, handleAs, proxy){
		function store(data){
			storage.set(url, {
				timestamp: new Date().toISOString(),
				data:data,
				expires: expires
			});
		}
		xhr.get(url, {
			proxy: proxy,
			handleAs:handleAs,
			callback: function(data){
				store(data);
				promise.resolve(data);	
			},
			errback: function(e){
				console.error('error loading url:', e);
				promise.reject(e);	
			}
		});
	}
	
	return function(url, expires, handleAs, proxy){
		var
			promise = new Promise(),
			object = storage.get(url);
		console.log('object', object);
		
		if(object){
			if(expired(object) || expires === -1){
				console.log('expired!');
				storage.remove(url);
				promise.cache = 'expired';
				load(url, promise, expires, handleAs, proxy);
			}else{
				console.log('from cache');
				promise.cache = 'from cache';
				promise.call(object.data);
			}
		}else{
			promise.cache = 'from server';
			load(url, promise, expires, handleAs, proxy);
		}
		
		return promise;
	};
	
});