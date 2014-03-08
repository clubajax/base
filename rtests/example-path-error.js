define([
	'xxx/observable'
], function(){
	
	var testName = 'example-path-error test';
	
	return function(options){
		options.begin(testName);
		
		options.end(testName);
	};
	
});