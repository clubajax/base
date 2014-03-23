var
	requirejs = require('./r'),
	defaultTests = [
		'observable',
        'dom'/*
		'example-syntax-error',
		'example-path-error'*/
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

//
//var
//	i,
//	tests = [],
//	catchErrors = 0,
//	total = 0,
//	pass = 0,
//	fail = 0,
//	errors = 0,
//    suitesSuccess = 0,
//    suitesFail = 0,
//	testsDivider = '========================================================================',
//	currentSuiteName = '',
//	currentTestName = '',
//	suiteDivider = '------------------------------------------------------------------------',
//	defaultTests = [
//		'observable',
//        'dom'/*
//		'example-syntax-error',
//		'example-path-error'*/
//	],
//	options = {
//		assert: function(exp, msg){
//			if(exp){
//				pass++;
//				console.log('PASS:', msg ||currentTestName);
//			}else{
//				fail++;
//				console.log('*FAIL*:', msg || currentTestName);
//			}
//		}	
//	};
//
//function argsToPaths(){
//	var args = process.argv.toString().split(',');
//	args = args.splice(2, args.length-1);
//	if(!args.length){
//		args = defaultTests;
//	}
//	
//	for(i = 0; i < args.length; i++){
//		args[i] = 'base/rtests/'+args[i];
//	}
//    console.log('ARGS', args);
//	return args;
//}
//
//
//function testBegin(){
//	console.log('\n'+testsDivider+'\nBegin '+total+' tests');
//	console.log(testsDivider);
//}
//
//function testEnd(){
//	// total and assertions may not match if multiple assertions in a test
//	// 
//	console.log('\n\n'+testsDivider+'\n\n'+total+' tests complete');
//	console.log('    suites loaded:', suitesSuccess);
//	console.log('    suites load fail:', suitesFail);
//    console.log('    pass:', pass);
//	console.log('    fail:', fail);
//	console.log('\n'+testsDivider);
//}
//
//function setSuiteName(name){
//	if(name !== currentSuiteName){
//		currentSuiteName = name;
//		console.log('\n' + suiteDivider);
//		console.log('  ', name, 'Suite');
//		console.log(suiteDivider);
//	}
//}
//
//function setTitle(name){
//	var len = suiteDivider.length - 4 - name.length;
//	currentTestName = name;
//	console.log('\n----', name, suiteDivider.substring(0,len));
//}
//
//function runTests(){
//	function runTest(testMethod){
//		setSuiteName(testMethod.suiteName);
//		setTitle(testMethod.title);
//		total++;
//		testMethod(options);
//		
//		// Can test for ticks or async callback here
//		
//		if(tests.length){
//			runTest(tests.shift());
//		}else{
//			testEnd();
//		}
//		
//	}
//	testBegin();
//	runTest(tests.shift());
//}
//
//function loadTestSuite(suite){
//	var
//		i,
//		testMethod,
//		suiteName = suite.suiteName;
//	
//	for(i = 0; i < suite.tests.length; i++){
//		testMethod = suite.tests[i].run;
//		testMethod.suiteName = suiteName;
//		testMethod.title = suite.tests[i].title;
//		tests.push(testMethod);
//	}
//}
//
//function loadTests(){
//
//    requirejs('base/rtests/HeadlessBrowser/browser');
//
//	var
//		path,
//		suite,
//		args = argsToPaths();
//		
//	while(args.length){
//		path = args.shift();
//        console.log('\nPATH', path);
//        try{
//            suite = requirejs(path);
//        }catch(e){
//            console.log('----------E:', e);
//            suitesFail++;
//            continue;
//        }
//        if(suite){
//            //console.log('suite', suite);
//            suitesSuccess++;
//            loadTestSuite(suite);
//        }else{
//            console.log('NOT FOUND:', path);
//        }
//	}
//	runTests();
//}
//
//
//
//loadTests();
//
//
