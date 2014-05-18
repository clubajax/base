var
	requirejs = require('./r'),
	defaultTests = [
		'observable',
		'dom',
		'base',
		'eventTree'
	];

requirejs.config({
	baseUrl: '../../../',
	paths: {
		'base': './base',
		'core':'./base/core',
		'test':'./base/rtests'
	},
	waitSeconds: 3
});

function getArgs(){
	var args = process.argv.toString().split(',');
	args = args.splice(2, args.length-1);
	if(!args.length){
		args = defaultTests;
	}
	return args;
}

requirejs([
	'base/rtests/HeadlessBrowser/browser',
	'base/rtests/tools/run-tests'
], function(browser, runTests){
	runTests(requirejs, getArgs());
});