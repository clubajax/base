define(['qu'], function(qu){
	
	qu.add('suite01', [
		{
			group01: function(t){
				var a = 3, b = 4;
				t.assert(1 + 2 === 3, '1 + 2 = 3');
				t.assert(a + b === 6, 'a + b = 6');
				t.assert(a + c === 6, 'a + b = 6');
			},
			group02: function(t){
				var a = 33, b = 44;
				t.t(7 * 7 === 49, '7 * 7 = 49');
				t.f(a + b === 66, 'a + b = 6');
				// testing fails
				t.f(7 * 7 === 49, '7 * 7 = 49');
				t.t(a + b === 66, 'a + b = 6');
			}
		},{
			group03: function(t){
				var a = 3, b = 4;
				t.assert(/mike/.test('mike was here'), 'mike RegExp');
			}
		}
	]);
	
});