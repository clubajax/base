define([
	'base/core/dcl',
	'base/core/Base',
	'base/core/EventTree'
], function(dcl, Base, EventTree){

    return {
		suiteName: 'Base',
		tests:[
			{
				title:'it should create an instance',
				run: function(t){
                    var
                        base = new Base();
                    t.assert(!!base, 'base exists');
                }
			},{
				title:'it should mix in properties',
				run: function(t){
                    var
							Parent = dcl(Base, {
								a:'',
								b:''
							}),
                        parent = new Parent({
								a:true,
								b:99
							});
                    t.assert(parent.a === true, 'parent.a === true');
                    t.assert(parent.b === 99, 'parent.b === 99');
                }
			},{
				title:'it should not mix in undefined properties',
				run: function(t){
					var
							Parent = dcl(Base, {
								a:'',
								b:''
							}),
						parent = new Parent({
								a:true,
								b:99,
								c:10,
								d:27
							});
					t.assert(parent.c === undefined, 'parent.c === undefined');
					t.assert(parent.d === undefined, 'parent.d === undefined');
				}
			},{
				title:'it should emit events',
				run: function(t){
				var
						result,
						Parent = dcl(Base, {
							a:'',
							b:''
						}),
					parent = new Parent({
							a:true,
							b:99,
							c:10,
							d:27
						});
					
					parent.on('foo', function(){
						result = true;	
					});
					parent.emit('foo');
					
					t.assert(result, 'emits event');
				}
			},{
				title:'it should not emit events after it is disposed',
				run: function(t){
				var
						result,
						Parent = dcl(Base, {
							a:'',
							b:''
						}),
					parent = new Parent({
							a:true,
							b:99,
							c:10,
							d:27
						});
					
					parent.on('foo', function(){
						result = true;	
					});
					parent.dispose();
					parent.emit('foo');
					
					t.assert(!result, 'should not emit event');
				}
			},{
				title:'events should bubble up the object chain',
				run: function(t){
					var
						Parent = dcl(Base, {}),
						Child = dcl(Base, {}),
						eventTree = new EventTree(),
						parent = new Parent({eventTree:eventTree.child()}),
						child = new Child({eventTree:parent.child()}),
						result = false;
		
					parent.on('foo', function(){
						result = true;	
					});
					child.emit('foo');
					
					t.assert(result, 'event bubbled');
				}
			}
        ]
    };
});
