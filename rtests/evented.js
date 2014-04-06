define([
	'base/core/Evented'
], function(Evented){
	
	var skip = 1;
	
    return {
		suiteName: 'Evented',
		tests:[
			{
				skip:skip,
				title:'it emits an event',
				run: function(t){
					var
						h,
						ev = new Evented();
					h = ev.on('foo', function(){
						t.assert(true);	
					});
					ev.emit('foo');
				}
			},{
				skip:skip,
				title:'it emits an event and passes an argument',
				run: function(t){
					var
						h,
						ev = new Evented();
					h = ev.on('foo', function(arg){
						t.assert(arg === 'bar');	
					});
					ev.emit('foo', 'bar');
				}
			},{
				skip:skip,
				title:'it emits an event and passes multiple arguments',
				run: function(t){
					var
						h, array = [1,2,3],
						ev = new Evented();
					h = ev.on('foo', function(a,b,c,d){
						t.assert(a === 'bar', "a === 'bar'");	
						t.assert(b === 99, "b === 99");	
						t.assert(c === true, "c === true");	
						t.assert(d === array, "d === array");	
					});
					ev.emit('foo', 'bar', 99, true, array);
				}
			},{
				skip:skip,
				title:'it pauses, preventing event emitting',
				run: function(t){
					var
						h, result = true,
						ev = new Evented();
					h = ev.on('foo', function(){
						result = false;	
					});
					h.pause();
					ev.emit('foo');
					t.assert(result, 'should not emit');
				}
			},{
				skip:skip,
				title:'it pauses, preventing event emitting',
				run: function(t){
					var
						h, result = true,
						ev = new Evented();
					h = ev.on('foo', function(){
						result = false;	
					});
					h.pause();
					ev.emit('foo');
					t.assert(result, 'should not emit');
				}
			},{
				skip:skip,
				title:'it should resume emitting events',
				run: function(t){
					var
						h, result = true,
						ev = new Evented();
					h = ev.on('foo', function(){
						result = false;	
					});
					h.pause();
					ev.emit('foo');
					t.assert(result, 'should not emit');
					h.resume();
					ev.emit('foo');
					t.assert(!result, 'it should emit');
				}
			},{
				skip:skip,
				title:'it should remove all listeners',
				run: function(t){
					var
						h, h2, result = true, result2 = true,
						ev = new Evented();
					h = ev.on('foo', function(){
						result = false;	
					});
					h2 = ev.on('foo', function(){
						result2 = false;	
					});
					
					
					ev.emit('foo');
					t.assert(result === false && result2 === false, 'it emits...');
					result = true;
					result2 = true;
					ev.removeAll();
					ev.emit('foo');
					t.assert(result && result2, 'it should not emit');
				}
			}
        ]
    };
});
