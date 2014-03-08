define([
	'core/observable'
], function(){
	
	var testName = 'example test';
	
	return function(options){
		options.begin(testName);
		options.end(testName);
	};
	
});