define([], function(){
	var uids = {};
	
	return {
		uid: function(name){
			name = (name || 'id');
			if(!uids[name]){
				uids[name] = 0;
			}
			uids[name]++;
			return name + '_' + uids[name];
		},
		
		copy: function(o){
			var i, key, o1 = {};
			if(Array.isArray(o)){
				o1 = [];
				for(i = 0; i < o.length; i++){
					if(typeof(o[i]) === 'object'){
						o1[i] = this.copy(o[i]);
					}else{
						o1[i] = o[i];
					}
				}
			}
			else{
				for(key in o){
					if(typeof(o[key]) === 'object'){
						o1[key] = this.copy(o[key]);
					}else{
						o1[key] = o[key];
					}
				}
			}
			return o1;
		},
		
		mix: function(){
			var
				i, key,
				args = Array.prototype.slice.call(arguments),
				mixTo = args.shift(),
				mixFrom;
			
			for(i = 0; i < args.length; i++){
				mixFrom = args[i];
				for(key in mixFrom){
					if(mixFrom.hasOwnProperty(key)){
						mixTo[key] = mixFrom[key];
					}
				}
			}
			return mixTo;
			
		},
		
		mixProps: function(){
			// only mixes in defined props
			// TODO: DRY this up with mix();
			var
				i, key,
				args = Array.prototype.slice.call(arguments),
				mixTo = args.shift(),
				mixFrom;
			
			for(i = 0; i < args.length; i++){
				mixFrom = args[i];
				for(key in mixFrom){
					if(mixFrom.hasOwnProperty(key)){
						if(mixTo[key] !== undefined){
							mixTo[key] = mixFrom[key];
						}
					}
				}
			}
			return mixTo;
			
		},
		
		clone: function(){
			
		},
		
		empty: function(obj){
			return !Object.keys(obj).length;
		},
		
		getObject: function(name){
			return name;
		}
	};
});