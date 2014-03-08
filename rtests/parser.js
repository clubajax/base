define([
	'test/domShim',
	'core/dom',
	'core/parser/parser'
], function(shim, dom, parser){
	var
	
		testName = 'parser',
		node;
	
	node = dom('div', {css:'parent'});
	dom('div', {css:'child-1'}, node);
	dom('div', {css:'grandchild'},
		dom('div', {css:'child-2'}, node));
	
	
	return function(options){
		options.begin(testName);
		parser.parse(node);
		options.end(testName);
	};
});