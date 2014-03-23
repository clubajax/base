define([
	'base/core/dom',
	'base/core/Widget'
], function(dom, Widget){

    return {
		suiteName: 'Widget-programmatic',
		tests:[
			{
				title:'create a widget',
				run: function(t){
					// Need some inner text for now. fixit later...
					document.body.innerHTML = "<div><div id='widget01'>a</div><div id='widget03'>a</div></div>";
					
					var w01, w02, w03;
			
					w01 = new Widget();
					t.assert(!!w01, 'empty widget, no args doesn\'t blow up');
					
					w02 = new Widget({}, 'widget01');
					t.assert(!!w02, 'no template, shows default template');
					
					w03 = new Widget({
						template:'<h3>Widget.appendChild</h3>',	
					});
					dom('#widget03').appendChild(w03.node);
					t.assert(!!w03, 'has template');
					t.assert(!!w03.node, 'has node');
					t.assert(!!w03.node.parentNode, 'has parentNode');

				}
			}
        ]
    };
});
