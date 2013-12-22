define(['./has'], function(has){
	//	`on` is a simple library for attaching events to nodes. Its primary feature
	//	is it returns a handle, from which you can pause, resume and remove the
	//	event. Handles are much easier to manipulate than using removeEventListener
	//	and recreating (sometimes complex or recursive) function signatures.
	//
	//	`on` is touch-friendly and will normalize touch events.
	//
	//	`on` supports `mouseleave` and `mouseeneter` events. These events are natively
	//	supported in Firefox and IE - and emulated for Chrome.
	//
	//	`on` also supports a custom `clickoff` event, to detect if you've clicked
	//	anywhere in the document other than the passed node
	//
	//	USAGE
	//		var handle = on(node, 'clickoff', callback);
	//		//	callback fires if something other than node is clicked
	//
	// USAGE
	//		var handle = on(node, 'mousedown', onStart);
	//		handle.pause();
	//		handle.resume();
	//		handle.remove();
	//
	//	`on` also supports multiple event types at once. The following example is
	//	useful for handling both desktop mouseovers and tablet clicks:
	//
	//	USAGE
	//		var handle = on(node, 'mouseover,click', onStart);
	//
	//
	//	`on` has an optional context parameter. The fourth argument can be 'this'
	//	(or some other object) to conveniently avoid the use of var `self = this;`
	//
	//	USAGE
	//		var handle = on(this.node, 'mousedown', 'onStart', this);
	//
	//	`on.multi` allows for connecting multiple events to a node at the same
	//	time. Note this requires a context (I think), so it is not applicable for
	//	anonymous functions.
	//
	//	USAGE
	//		handle = on.multi(document, {
	//			"touchend":"onEnd",
	//			"touchcancel":"onEnd",
	//			"touchmove":this.method
	//		}, this);
	//
	//	`on.bind` is a convenience method for binding context to a method.
	//
	//	USAGE
	//		callback = on.bind(this, 'myCallback');
	//
	//	`on` supports an optional ID that can be used to track connections to be
	//	disposed later.
	//
	//	USAGE
	//		on(node, 'click', callback, 'uid-a');
	//		on(node, 'mouseover', callback, 'uid-a');
	//		on(otherNode, 'click', callback, 'uid-a');
	//		on(document, 'load', callback, 'uid-a');
	//		on.remove('uid-a');
	//
	//	`on` supports selectors, seperated from the event by a space:
	//
	//	USAGE
	//		on(node, 'click div.tab span', callback);
	//
	var
		registry = {},
		register = function(id, handle){
			if(!registry[id]){
				registry[id] = [];
			}
			registry[id].push(handle);
		},
		makeMultiHandle = function(handles){
			return {
				remove: function(){
					handles.forEach(function(h){ h.remove(); });
					handles = [];
					this.remove = this.pause = this.resume = function(){};
				},
				pause: function(){
					handles.forEach(function(h){ h.pause(); });
				},
				resume: function(){
					handles.forEach(function(h){ h.resume(); });
				}
			};
		},
		bind = function(ctx, callback){
			// binds a function to a context which can be passed
			// around and used later
			//      ctx:
			//          `this` or an object
			//      callback:
			//          a function, method or string reference
			//          to a method.
			//
			if(typeof(callback) === "string"){
				if(!callback){ callback = ctx; ctx = window; }
				return function(){
					ctx[callback].apply(ctx, arguments); };
			}else{
				var
                    method = !!callback ? ctx.callback || callback : ctx,
                    scope = !!callback ? ctx : window;

				return function(){  method.apply(scope, arguments); };
			}
		},

		onClickoff = function(node, callback){
			var
				isOver = false,
				lHandle = on(node, 'mouseleave', function(){
					isOver = false;
				}),
				eHandle = on(node, 'mouseenter', function(){
					isOver = true;
				}),
				bHandle = on(document.body, 'click', function(event){
					if(!isOver){
						callback(event);
					}
				});
	
			return makeMultiHandle([lHandle, eHandle, bHandle]);
		},

		onMouseEnter = function(node, eventType, callback){
			var
				isOver = false,
				handle = on(document.body, 'mousemove', function(event){
					var
						rect = node.getBoundingClientRect(),
						isOverNode =
							event.clientX > rect.left &&
							event.clientX < rect.right &&
							event.clientY > rect.top &&
							event.clientY < rect.bottom;
	
					if(!isOver && isOverNode){
						isOver = true;
						callback(event);
					}else if(!isOverNode){
						isOver = false;
					}
				});
	
			return handle;
		},

		onMouseLeave = function(node, eventType, callback){
			var
				isOver = false,
				handle = on(document.body, 'mousemove', function(event){
					var
						rect = node.getBoundingClientRect(),
						isOverNode =
							event.clientX > rect.left &&
							event.clientX < rect.right &&
							event.clientY > rect.top &&
							event.clientY < rect.bottom;
	
					if(isOver && !isOverNode){
						isOver = false;
						callback(event);
					}else if(isOverNode){
						isOver = true;
					}
				});
	
			return handle;
		},
	
		getNode = function(str){
			var node;
			if(/\#|\.|\s/.test(str)){
				node = document.body.querySelector(str);
			}else{
				node = document.getElementById(str);
			}
			if(!node){
				console.error('core/on Could not find:', str);
			}
			return node;
		},

		normalizeWheelEvent = function(callback){
			return function(e){
				//console.log('WHEEL!'); for(var k in e){ if(typeof e[k] !== 'function' && typeof e[k] !== 'object') { console.log('    ', k, '=', e[k]);}}
	
				// Old school scrollwheel delta
				if (e.wheelDelta || e.detail) {
					if (e.wheelDelta) {
						e.delta = e.wheelDelta / 120;
					}
					if (e.detail) { // if zero, ignore
						e.delta = e.detail / -3;
					}
	
					// New school multidimensional scroll (touchpads) deltas
					e.deltaY = e.delta;
				}
	
				// Gecko (delta set from above)
				if (e.axis !== undefined) {
					if(e.axis === e.HORIZONTAL_AXIS){
						e.deltaY = 0;
						e.deltaX = -1 * e.delta;
					}else{
						// vertical
						e.deltaY = -1 * e.delta;
						e.deltaX = 0;
					}
				}
	
				// Webkit
				if (e.wheelDeltaY !== undefined) {
					e.delta = e.deltaY = e.wheelDeltaY / 120;
					e.deltaX = 0;
				}
				if (e.wheelDeltaX !== undefined) {
					e.delta = e.deltaX = -1 * e.wheelDeltaX / 120;
				}
	
				if(!e.delta){
					e.delta = e.deltaX || e.deltaY;
				}
	
				// modern browsers (Firefox, IE9+)
				//if(e.deltaX || e.deltaY)
				// passthrough, no change
	
	
				callback(e);
			};
		},

		on = function(node, eventType, callback, optionalContext, id){
			//  USAGE
			//      var handle = on(this.node, 'mousedown', this, 'onStart');
			//      handle.pause();
			//      handle.resume();
			//      handle.remove();
			//
			var
				handles,
				handle,
				targetCallback,
				childTarget = false;
	
			if(/,/.test(eventType)){
				// handle multiple event types, like:
				// on(node, 'mouseup, mousedown', callback);
				//
				handles = [];
				eventType.split(',').forEach(function(eStr){
					handles.push(on(node, eStr.trim(), callback, optionalContext, id));
				});
				return makeMultiHandle(handles);
			}
	
			if(typeof optionalContext === 'string'){
				// no context. Last argument is handle id
				id = optionalContext;
				optionalContext = null;
			}
	
			node = typeof node === 'string' ? getNode(node) : node;
			callback = !!optionalContext ? bind(optionalContext, callback) : callback;

			if(/\s/.test(eventType)){
				// handle child selectors, like:
				// on(node, 'click div.tab span', callback);
				//
				childTarget = eventType.substring(eventType.indexOf(' ') + 1, eventType.length);
				eventType = eventType.substring(0, eventType.indexOf(' '));
				targetCallback = callback;
				callback = function(e){
						var i, nodes = node.querySelectorAll(childTarget);
						for(i = 0; i < nodes.length; i ++){
						if(nodes[i] === e.target || nodes[i].contains(e.target)){
							e.selectorElement = nodes[i];
							//console.log('found one!');
							targetCallback(e);
							break;
						}
					}
				};
			}

			if(eventType === 'clickoff'){
				// custom - used for popups 'n stuff
				return onClickoff(node, callback);
			}
	
			if(eventType === 'mouseenter' && !has('mouseenter')){
				// Chrome does not support these events. Route through custom handler
				return onMouseEnter(node, eventType, callback);
			}
	
			if(eventType === 'mouseleave' && !has('mouseleave')){
				// Chrome does not support these events. Route through custom handler
				return onMouseLeave(node, eventType, callback);
			}
	
			if(eventType === 'wheel'){
				// mousewheel events, natch
				if(has('wheel')){
					// pass through, but first curry callback to wheel events
					callback = normalizeWheelEvent(callback);
				}else{
					// old Firefox, old IE, Chrome
					return on.multi(node, {
						DOMMouseScroll:normalizeWheelEvent(callback),
						mousewheel:normalizeWheelEvent(callback)
					}, optionalContext);
				}
			}
	
			if(eventType === 'scroll'){
				// TODO! different than wheel?
				console.log('on.scroll not implemented');
			}
	
			node.addEventListener(eventType, callback, false);
			
			handle = {
				remove: function() {
					node.removeEventListener(eventType, callback, false);
					node = callback = null;
					this.remove = this.pause = this.resume = function(){};
				},
				pause: function(){
					node.removeEventListener(eventType, callback, false);
				},
				resume: function(){
					node.addEventListener(eventType, callback, false);
				}
			};
	
			if(id){
				// If an ID has been passed, regsiter it so it can be used to
				// remove multiple events by id
				register(id, handle);
			}
	
			return handle;
		};
	
		on.multi = function(node, map, context, id){
			//  USAGE
			//      handle = on.multi(document, {
			//          "touchend":"onEnd",
			//          "touchcancel":"onEnd",
			//          "touchmove":this.method
			//      }, this);
			//
			var eventType,
				handles = [];
	
			for( eventType in map ){
				if(map.hasOwnProperty(eventType)){
					handles.push(on(node, eventType, map[eventType], context, id));
				}
			}
	
			return makeMultiHandle(handles);
		};
	
		on.bind = bind;
	
		on.ancestor = function(node, selector){
			// gets the ancestor of node based on selector criteria
			// useful for getting the target node when a child node is clicked upon
			// 
			// TODO: reassess this functionality
			//
			// USAGE
			//      on.selector(childNode, '.app.active');
			//      on.selector(childNode, '#thinger');
			//      on.selector(childNode, 'div');
			//      
			var
				test,
				parent = node;
	
			if(selector.indexOf('.') === 0){
				// className
				selector = selector.replace('.', ' ').trim();
				test = function(n){
					return n.classList.contains(selector);
				};
			}
			else if(selector.indexOf('.') === 0){
				// node id
				selector = selector.replace('#', '').trim();
				test = function(n){
					return n.id === selector;
				};
			}
			else if(selector.indexOf('[') > -1){
				// attribute
				console.error('attribute selectors are not yet supported');
			}
			else{
				// assuming node name
				selector = selector.toUpperCase();
				test = function(n){
					return n.nodeName === selector;
				};
			}
	
			while(parent){
				if(parent === document.body){ return false; }
				if(test(parent)){ break; }
				parent = parent.parentNode;
			}
	
			return parent;
		};
	
		on.isAncestor = function(parent, child){
			// DEPRECATED - use parent.contains(child);
			// determines if parent is an ancestor of child
			// returns boolean
			// TODO: move to localLib/dom
			// 
			if(parent === child){ return false; } // do we always want the same node to be false?
			while(child){
				if(child === parent){
					return true;
				}
				child = child.parentNode;
			}
			return false;
		};
		
		on.remove = function(handles){
			// convenience function;
			// removes one or more handles;
			// accepts one handle or an array of handles;
			// accepts different types of handles (dispose/remove/topic token)
			//
			var i, h, idHandles;
			if(typeof handles === 'string'){
				idHandles = registry[handles];
				if(idHandles){
					idHandles.forEach(function(h){
						h.remove();
					});
					idHandles = registry[handles] = null;
					delete registry[handles];
				}else{
					console.warn('Tried to remove on.handle, but id not found:', handles);
				}
	
				return [];
			}
			if(Object.prototype.toString.call(handles) !== '[object Array]'){
				handles = [handles];
			}
	
			for( i = 0; i < handles.length; i++ ){
				h = handles[i];
	
				if(h){ // check for nulls / already removed handles
					if(h.remove){
						// on handle, or AOP
						h.remove();
					}
					else if(h.dispose){
						// knockout
						h.dispose();
					}else{
						console.log('handle type not recognized', h);
					}
				}else{
					console.log('null handle');
				}
			}
			return [];
		};

    return on;
});
