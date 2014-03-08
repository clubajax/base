define([
	'test/domShim',
	'core/dom'
], function(shim, dom){
	var testName = 'dom';
	
	return function(options){
		options.begin(testName);
		
		var node = dom('div', {css:'test', html:'test', style:{color:'#fff'}, attr:{id:'test'}});
		console.log('node:', node);
		
		console.log('get color', dom.style(node, 'color'));
		console.log('get id', dom.attr(node, 'id'));
		console.log('destroy:', dom.destroy(node));
		
		options.end(testName);
	};
});