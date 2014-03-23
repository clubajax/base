define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/Widget',
	'base/core/parser/main'
], function(dcl, dom, Widget, parser){

    return {
		suiteName: 'Widget-declarative',
		tests:[
			{
				title:'create ParentWidget',
				run: function(t){
					document.body.innerHTML =	"<div id='widget01' data-widget='ParentWidget'></div>";
					
					dcl(Widget, {
						declaredClass:'ParentWidget',
						template:	'<div class="ParentWidget">' +
										'<h3>Parent Widget</h3>' +
									'</div>'
					});
					
					parser.parse();
					t.assert(document.body.firstChild.className === 'ParentWidget', "firstChild.className === 'ParentWidget'");
					

				}
			},{
				title:'create ChildWidget',
				run: function(t){
					document.body.innerHTML =	"<div><div id='widget01' data-widget='ParentWidget'>" +
														"<div data-widget='ChildWidget'></div>" +
													"</div>";
					
					dcl(Widget, {
						declaredClass:'ChildWidget',
						template:'<div class="ChildWidget">' +
										'<h3>Child Widget</h3>' +
									'</div>'
					});
					
					dcl(Widget, {
						declaredClass:'ParentWidget',
						template:	'<div class="ParentWidget">' +
										'<h3>Parent Widget</h3>' +
									'</div>'
					});
					
					parser.parse();

				}
				
			}/*,{
				title:'create a declarative widget',
				run: function(t){
					// Need some inner text for now. fixit later...
					document.body.innerHTML =	"<div><div id='widget01' data-widget='ParentWidget'>" +
														"<div data-widget='ChildWidget'>" +
															"<div data-widget='GrandChildWidget' data-props='displayText:Grand Child Widget!'></div>" +
														"</div>" +
													"</div>" +
													"<div id='widget02'></div>" +
													"<div id='widget03'></div></div>";
					//return;
					dcl(Widget, {
						declaredClass:'GrandChildWidget',
						displayText:'Defult Display Text',
						template:'<div class="GrandChildWidget"><h3>{{displayText}}</h3></div>'
					});
					
					dcl(Widget, {
						declaredClass:'ChildWidget',
						template:'<div class="ChildWidget">' +
										'<h3>Child Widget</h3>' +
									'</div>'
					});
					
					dcl(Widget, {
						declaredClass:'ParentWidget',
						template:	'<div class="ParentWidget">' +
										'<h3>Parent Widget</h3>' +
									'</div>'
					});
					
					parser.parse();

				}
				
			}*/
        ]
    };
});
