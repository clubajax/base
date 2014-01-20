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

function formatRed (msg){
	return '[c="color: red; font-weight: bold;"]'+msg+'[c]';
}
function formatGreen (msg){
	return '[c="color: green; font-weight: bold;"]'+msg+'[c]';
}

var
	i,
	args = process.argv.toString().split(','),
	options = {
		begin: function(name){
			console.log('\n'+name+'\n--------------------');
		},
		end: function(name){
			console.log(name+' complete without errors');
		}
	};

//console.log('args', args);
args = args.splice(2, args.length-1);
//console.log(' ---- args', args);

for(i = 0; i < args.length; i++){
	args[i] = 'test/'+args[i];
}

console.log('r args', args);

requirejs(args, function(){
	var
		test,
		pass = 0,
		fail = 0,
		total = 0,
		currentTestName,
		tests = Array.prototype.slice.call(arguments);
	
	
	function runTest(){
		if(tests.length){
			test = tests.shift();
			if(typeof test === 'function'){
				try{
				test({
					begin: function(name){
						total++;
						currentTestName = name;
						console.log('\n'+name+'\n--------------------');
					},
					end: function(name){
						pass++;
						console.log(name+' complete without errors');
						runTest();
					}
				});
				}catch(e){
					fail++;
					console.error('*ERROR*', currentTestName);
					console.error(e);
					runTest();
				}
			}else{
				console.log('module did not return a function', test);
			}
		}else{
			console.log('\n\n==================\n\n'+total+' tests complete');
			console.log('    pass:', pass);
			console.log('    fail:', fail);
			console.log('\n==================');
		}
	}
	console.log('\n\n===========\nstart tests\n===========');
	runTest();
});

//require('core/'+args[0]);