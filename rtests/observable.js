//require.config({
//	baseUrl: '../../',
//	paths: {
//		'base': './base',
//		'core':'./base/core'
//	},
//	waitSeconds: 15
//});
//
//


console.log('******** observable loaded');


define([
	'core/observable'
], function(observable) {
	
	var testName = 'observable';
	
	return function (options){
		
		options.begin(testName);
		
		var timer, likes, pie, o, snack, p;
	
		timer = function(obs, val, callback){
			setTimeout(function(){
				obs(val);
				if(callback){
					callback();
				}
			}, 100);
		};
		
		
		p = observable('paramable');
		p.sub(function(value, a,b,c){
			console.log('P::', value);
			console.log('P.option:', a,b,c);
		});
		p('p.changed', 'with an option');
		p('p.again', 'opt1', 'opt2', 'opt3');
	
		pie = observable();
		pie.sub(function(v){
			if(v === 1){
				return v + ' pie';
			}
			if(v > 9){
				return 'A LOT OF PIE';
			}
			return v + ' pies';
		});
		pie.subscribe(function(v){
			console.log('I eat', v);
		});
		pie(1);
		pie(2);
		pie(10);
		console.log('How much pie? ', pie());
		
		o = {
			init: function(){
				snack = observable();
				snack.subscribe(this.onValue, this);
				snack('munch');
			},
			onValue: function(v){
				console.log('contextual value: ', v);
			}
		};
		o.init();
	
		// TODO
		// Test Array methods
	
		//async
		likes = observable();
		likes.subscribe(function(v){
			console.log('likes: ', v);
			if(v === 'pie'){
				options.end(testName);
			}
		});
		timer(likes, 'nothing', function(){
			timer(likes, 'pie');
				
		});
		
		
	};

});