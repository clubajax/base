var requirejs = require('./r');

requirejs.config({
	baseUrl: '../../',
	paths: {
		'base': './base',
		'core':'./base/core',
		'test':'./base/rtests'
	},
	waitSeconds: 3
});

var
	i,
	tests = [],
	catchErrors = 0,
	total = 0,
	pass = 0,
	fail = 0,
	errors = 0,
	testsDivider = '========================================================================',
	currentSuiteName = '',
	currentTestName = '',
	suiteDivider = '------------------------------------------------------------------------',
	defaultTests = [
		'observable',
		'example',
		'example-syntax-error',
		'example-path-error'				
	],
	options = {
		assert: function(exp, msg){
			if(exp){
				pass++;
				//console.log('Ã:', currentTestName);
			}else{
				fail++;
				console.log('*FAIL*:', currentTestName);
			}
		}	
	};

function argsToPaths(){
	var args = process.argv.toString().split(',');
	args = args.splice(2, args.length-1);
	if(!args.length){
		args = defaultTests;
	}
	
	for(i = 0; i < args.length; i++){
		args[i] = 'test/'+args[i];
	}
	return args;
}


function testBegin(){
	console.log('\n'+testsDivider+'\nBegin '+total+' tests');
	console.log(testsDivider);
}

function testEnd(){
	// total and assertions may not match if multiple assertions in a test
	// 
	console.log('\n\n'+testsDivider+'\n\n'+total+' tests complete');
	console.log('    pass:', pass);
	console.log('    fail:', fail);
	console.log('\n'+testsDivider);
}

function setSuiteName(name){
	if(name !== currentSuiteName){
		currentSuiteName = name;
		console.log('\n' + suiteDivider);
		console.log('  ', name, 'Suite');
		console.log(suiteDivider);
	}
}

function setTitle(name){
	var len = suiteDivider.length - 4 - name.length;
	currentTestName = name;
	console.log('\n----', name, suiteDivider.substring(0,len));
}

function runTests(){
	function runTest(testMethod){
		setSuiteName(testMethod.suiteName);
		setTitle(testMethod.title);
		total++;
		testMethod(options);
		
		// Can test for ticks or async callback here
		
		if(tests.length){
			runTest(tests.shift());
		}else{
			testEnd();
		}
		
	}
	testBegin();
	runTest(tests.shift());
}

function loadTestSuite(suite){
	var
		i,
		testMethod,
		suiteName = suite.suiteName;
	
	for(i = 0; i < suite.tests.length; i++){
		testMethod = suite.tests[i].run;
		testMethod.suiteName = suiteName;
		testMethod.title = suite.tests[i].title;
		tests.push(testMethod);
	}
}

function loadTests(){
	var
		path,
		suite,
		args = argsToPaths();
		
	while(args.length){
		path = args.shift();
		suite = requirejs(path);
		loadTestSuite(suite);
	}
	runTests();
}



loadTests();


