define([], function(){
	//
	//	storage
	//		A light wrapper around native localStorage
	//		
	var prefix = document.location.host;
	
	function getKey(key){
		return prefix + '_' + key;
	}
	
	function isPrefix(key){
		return key.indexOf(prefix) > -1;
	}
	
	return {
		get: function(key){
			key = getKey(key);
			var value = localStorage.getItem(key);
			if(value === undefined || value === 'undefined'){
				return undefined;
			}
			return JSON.parse(value);
		},
		set: function(key, value){
			key = getKey(key);
			localStorage.setItem(key, JSON.stringify(value));
		},
		remove: function(key){
			localStorage.removeItem(key);
		},
		contains: function(key){
			return !!localStorage.getItem(key);
		},
		clear: function(){
			for(var key in localStorage){
				if(localStorage.hasOwnProperty(key) && isPrefix(key)){
					console.log('clear:', key);
					localStorage.removeItem(key);
				}
			}
		}
	};
	
});