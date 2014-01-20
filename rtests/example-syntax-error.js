define([
	'core/observable'
], function(){
	
	var testName = 'example-syntax-error test';
	
	return function(options){
		options.begin(testName);
		
		a = b + 1;
		
		options.end(testName);
	};
	
});