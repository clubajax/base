define([
	'test/domShim',
	'core/dom',
	'core/Widget'
], function(shim, dom, Widget){
	var
	
		testName = 'Widget',
		node;
	
	node = dom('div', {css:'parent'});
	
	return function(options){
		options.begin(testName);
		var w = new Widget({}, node);
		console.log('widget:', w);
		options.end(testName);
	};
});