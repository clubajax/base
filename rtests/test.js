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
	args = process.argv.toString().split(','),
	defaultTests = [
		'observable',
		'example',
		'example-syntax-error',
		'example-path-error'				
	];

args = args.splice(2, args.length-1);
if(!args.length){
	args = defaultTests;
}

for(i = 0; i < args.length; i++){
	args[i] = 'test/'+args[i];
}


function runtests(){
	var
		test,
		path,
		pass = 0,
		fail = 0,
		total = 0,
		currentTestName;
	
	function runtest(){
		if(args.length){
			path = args.shift();
			try{
				test = requirejs(path);
			}catch(e){
				console.error('PATH ERROR', path);
				console.error('', e);
				fail++;
				runtest();
			}
			//requirejs([path], function(test){
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
							runtest();
						}
					});
					}catch(e){
						fail++;
						console.error('*ERROR*', currentTestName);
						console.error(e);
						runtest();
					}
				}else{
					console.log('module did not return a function', test);
				}
			//});
			
		}else{
			console.log('\n\n==================\n\n'+total+' tests complete');
			console.log('    pass:', pass);
			console.log('    fail:', fail);
			console.log('\n==================');
		}
	}
	runtest();
}

runtests();

