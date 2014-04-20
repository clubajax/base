if(/Android/.test(navigator.userAgent)){
	console.log('ANDROID');
	
	console._log = console.log;
	console.log = function(){
		var args = Array.prototype.slice.apply(arguments);
		console._log(args.join(' '));
	};
}