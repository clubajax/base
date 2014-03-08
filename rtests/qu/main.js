define([
		
], function(){
	
	var
		log = function(){
			console.log.apply(console, arguments);	
		},
		anon = 0,
		suites = {},
		lines = [],
		logs = {
			add: function(msg){
				//log(msg);
				lines.push(msg);	
			}	
		},
		printLogs = function(){
			for(var i = 0; i < lines.length; i++ ){
				log(lines[i]);
			}
		},
		formatRed = function(msg){
			return '[c="color: red; font-weight: bold;"]'+msg+'[c]';
		},
		formatGreen = function(msg){
			return '[c="color: green; font-weight: bold;"]'+msg+'[c]';
		},
		
		FAIL =   formatRed('      fail:'),
		PASS = formatGreen('      pass:'),
		
		runExpression = function( expression, msg, isFalse ){
			var
				r,
				errMsg = isFalse ? 'should not be equal' : 'should be equal';
			try{
				r = typeof expression === 'function' ? expression() : expression;
				if(isFalse && !r || !isFalse && !!r){
					logs.add(PASS + msg + ' -> ' + r + ';');
				}else{
					logs.add(FAIL + '`'+msg + '` -> ' + r + '; error: ' + errMsg);
				}
			}catch(e){
				logs.add(FAIL + msg + ' -> ' + r + '; error: ' + e.message );
			}
		},
		
		tester = {
			assert: function( expression, msg ){
				runExpression( expression, msg );
			},
			assertFalse: function( expression, msg ){
				runExpression( expression, msg, true );
			},
			t: function( expression, msg ){
				runExpression( expression, msg );
			},
			f: function( expression, msg ){
				runExpression( expression, msg, true );
			}
		};

	
	function runTests(name, tests){
		logs.add('    run tests: _' + name +'_');
		try{
			tests(tester);
		}catch(e){
			logs.add(FAIL + name + ' error: ' + e.message );
		}
	}
	
	function runGroupObject( name, group ){
		logs.add('  group: _' + name +'_');
		var t;
		for( t in group ){
			if(group.hasOwnProperty(t)){
				runTests(t, group[t]);
			}
		}
	}
	
	function runSuiteArray( suite ){
		var i, group;
		for( i = 0; i < suite.length; i++ ){
			group = suite[i];
			if( typeof group === 'object'){
				runGroupObject( i, group );
			}else{
				
			}
		}
	}
	
	function run(){
		var name;
		for( name in suites ){
				if(suites.hasOwnProperty(name)){
				logs.add('suite: _' + name +'_');
				if(Array.isArray( suites[ name ])){
					runSuiteArray( suites[ name ] );
				}else{
					
				}
			}
		}
		printLogs();
		log('*tests done*');
	}
	
	function addSuite(name, suite){
		if(typeof name === 'object'){
			suite = name;
			name = 'anonymous' + (anon++);
		}
		suites[name] = suite;
	}
	
	return {
		add: addSuite,
		run:run
	};	
});