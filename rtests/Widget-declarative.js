define([
	'base/core/dcl',
	'base/core/dom',
	'base/core/Widget',
	'base/core/parser/main'
], function(dcl, dom, Widget, parser){
	
	var skip = 1;
	
    return {
		suiteName: 'Widget-declarative',
		tests:[
			{
				skip:skip,
				title:'create a Parent widget',
				run: function(t){
					document.body.innerHTML =	"<div id='widget01' data-widget='ParentWidget'></div>";
					
					dcl(Widget, {
						declaredClass:'ParentWidget',
						template:	'<div class="ParentWidget">' +
										'<h3>Parent Widget</h3>' +
									'</div>'
					});
					
					parser.parse();
					var widget = document.getElementById('widget01');
					
					t.assert(document.body.firstChild.className === 'ParentWidget', "firstChild.className === 'ParentWidget'");
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');

				}
			},{
				skip:skip,
				title:'create parent and child widgets',
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
					
					//document.body.log();
					
					var widget = document.getElementById('widget01');
					
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					t.assert(widget.children[1].getAttribute('widgetId'), 'second child is parsed');
					
				}
				
			},{
				skip:skip,
				title:'parse deep nested widget',
				run: function(t){
					document.body.innerHTML =	"<div>" +
														"<div id='widget01' data-widget='ParentWidget'>" +
															"<div>" +
																"<div>" +
																	"<div id='deepWidget' data-widget='ChildWidget'></div>" +
																"</div>" +
															"</div>" +
														"</div>" +
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
					
					//document.body.log();
					
					var widget = document.getElementById('deepWidget');
					
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					
				}
				
			},{
				skip:skip,
				title:'create sibling children widgets',
				run: function(t){
					document.body.innerHTML = "<div><div id='widget01' data-widget='ParentWidget'>" +
														"<div class='c1'></div>" +
														"<div class='c2'></div>" +
													"</div></div>";
					//document.body.log(); return;
					
					document.body.innerHTML =	"<div><div id='widget01' data-widget='ParentWidget'>" +
														"<div data-widget='ChildWidget' class='child1'></div>" +
														"<div data-widget='ChildWidget' class='child2'></div>" +
													"</div>";
													
					//document.body.log();
					
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
					
					//document.body.log('body-child-child');
					var widget = document.getElementById('widget01');
					
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					t.assert(widget.children[1].getAttribute('widgetId'), 'second child is parsed');
					t.assert(widget.children[2].getAttribute('widgetId'), 'third child is parsed');
				}
				
			},{
				skip:skip,
				title:'create a grandchild widget',
				run: function(t){
					document.body.innerHTML =	"<div>" +
														"<div id='widget01' data-widget='ParentWidget'>" +
															"<div data-widget='ChildWidget'>" +
																"<div id='grandchild' data-widget='GrandChildWidget' data-props='displayText:Grand Child Widget!'></div>" +
															"</div>" +
														"</div>" +
														"<div id='widget02'> </div>" +
														"<div id='widget03'> </div>" +
													"</div>";
					
					//document.body.log();
					
					dcl(Widget, {
						declaredClass:'GrandChildWidget',
						displayText:'Default Display Text',
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
					
					//document.body.log();
					
					var widget = document.getElementById('grandchild');
					
					t.assert(widget, 'grandchild exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					t.assert(widget.firstChild.innerHTML === 'Grand Child Widget!', 'data-props attribute set and used');

				}
				
			},{
				skip:skip,
				title:'parse attributes',
				run: function(t){
					document.body.innerHTML =	"<div id='widget01' data-widget='AttrWidget' data-props='displayText:Grand Child Widget!'></div>";
					
					//document.body.log();
					
					dcl(Widget, {
						declaredClass:'AttrWidget',
						displayText:'Default Display Text',
						template:'<div class="AttrWidget"><h3>{{displayText}}</h3></div>'
					});
					
					
					parser.parse();
					
					//document.body.log();
					
					var widget = document.getElementById('widget01');
					
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					t.assert(widget.firstChild.innerHTML === 'Grand Child Widget!', 'data-props attribute set and used');
					
				}				
			},{
				skip:skip,
				title:'parse multiple attributes',
				run: function(t){
					document.body.innerHTML =	"<div id='widget01' data-widget='AttrWidget' data-props='displayText:Attr Widget!,otherText:More text yo!'></div>";
					
					//document.body.log();
					
					dcl(Widget, {
						declaredClass:'AttrWidget',
						displayText:'default display text',
						otherText:'default other text',
						template:'<div class="AttrWidget"><h3>{{displayText}} / {{otherText}}</h3></div>'
					});
					
					
					parser.parse();
					
					//document.body.log();
					
					var widget = document.getElementById('widget01');
					
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					t.assert(widget.firstChild.innerHTML === 'Attr Widget! / More text yo!', 'data-props attribute set and used');
					
				}				
			},{
				skip:0,
				title:'parse widget in template',
				run: function(t){
					document.body.innerHTML =	"<div id='widget01' data-widget='WidgetWithSub' data-props='titleText:Widget with Sub!,otherText:More text yo!'></div>";
					
					//document.body.log();
					
					dcl(Widget, {
						declaredClass:'SubWidget',
						template:'<div class="MyWidget">The Sub Widget</div>'
					});
						
					dcl(Widget, {
						declaredClass:'WidgetWithSub',
						otherText:'other text.',
						titleText:'title text.',
						template:'<div class="WidgetWithSub"><h3>Parent Widget / {{titleText}} / {{otherText}}</h3><div class="SubWidget" data-widget="SubWidget">did not render<div></div>'
					});
					
					
					parser.parse();
					
					document.body.log();
					
					var widget = document.getElementById('widget01');
					
					t.assert(widget, 'widget01 exists');
					t.assert(widget.firstChild.nodeName === 'H3', 'first child is H3');
					t.assert(widget.firstChild.innerHTML === 'Parent Widget / Widget with Sub! / More text yo!', 'data-props attribute set and used');
					
				}				
			}
        ]
    };
});
