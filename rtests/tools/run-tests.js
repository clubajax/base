define([], function(){

	return function(requirejs, args, isNode){
		var
			i,
			tests = [],
			//catchErrors = 0,
			total = 0,
			pass = 0,
			fail = 0,
			suitesSuccess = 0,
			suitesFail = 0,
			testsDivider = '========================================================================',
			currentSuiteName = '',
			currentTestName = '',
			suiteDivider = '------------------------------------------------------------------------',
			defaultTests = [
				'observable',
				'dom'
			],
			options = {
				assert: function(exp, msg){
					if(exp){
						pass++;
						console.log('PASS:', msg ||currentTestName);
					}else{
						fail++;
						console.log('*FAIL*:', msg || currentTestName);
						throw new Error('*FAIL*: ' + ( msg || currentTestName ));
					}
				}	
			};
		
		
		function testBegin(){
			console.log('\n'+testsDivider+'\nBegin '+total+' tests');
			console.log(testsDivider);
		}
		
		function testEnd(){
			// total and assertions may not match if multiple assertions in a test
			// 
			console.log('\n\n'+testsDivider+'\n\n'+total+' tests complete');
			console.log('    suites loaded:', suitesSuccess);
			console.log('    suites load fail:', suitesFail);
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
				var skip = testMethod.skip;
				skip = 'node' ? isNode : skip;
				if(!skip){
					setSuiteName(testMethod.suiteName);
					setTitle(testMethod.title);
					total++;
					testMethod(options);
				}
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
				testMethod.skip = suite.tests[i].skip;
				tests.push(testMethod);
			}
		}
		
		function argsToPaths(){
			console.log('args to paths', args);
			if(!args.length){
				console.log('default tests loaded');
				args = defaultTests;
			}
			
			for(i = 0; i < args.length; i++){
				if(args[i] === 'browser'){
					args[i] = 'base/rtests/HeadlessBrowser/test';
				}else{
					args[i] = 'base/rtests/'+args[i];
				}
			}
			console.log(' > ARGS', args);
			return args;
		}
		
		function loadTests(){
		
			var
				args = argsToPaths();
			
			requirejs(args, function(){
				for(var i = 0; i < arguments.length; i++){
					suitesSuccess++;
					loadTestSuite(arguments[i]);
				}
				runTests();
			});			
		}
		
		loadTests();
	};	
});