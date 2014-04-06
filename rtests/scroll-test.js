define([
	'base/core/dom',
	'base/core/on',
	'base/core/xhr',
], function(dom, on, xhr){
	
    return {
		suiteName: 'Widget-declarative',
		tests:[
			{
				skip:'node',
				title:'test scroll',
				run: function(t){
					document.body.innerHTML =	"<div class='wrap test-scroll'><div id='list'></div></div>";
					console.log('xhr');
					xhr.get('../scroll-test-dom.html', {
						handleAs:'text',
						callback: function(data){
							//console.log('JSON', data);
							dom.byId('list').innerHTML = data;
							
							var
								head = dom.byId('test-head'),
								body = dom.byId('test-body');
							on(body, 'scroll', function(){
								console.log('scroll');
								head.scrollLeft = body.scrollLeft;
							});
						}	
					});
					
				}
			}
		]
	};
});