define([], function(){
	var _uids = {};
	
	return {
		uid: function(name){
			name = (name || 'id');
			if(!_uids[name]){
				_uids[name] = 0;
			}
			_uids[name]++;
			return name + '_' + _uids[name];
		},
		getObject: function(name){
			return name;
		}
	};
});