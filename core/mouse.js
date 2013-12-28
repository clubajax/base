define(['./has', './on', './logger'], function(has, on, logger){
	//	summary:
	//		This module is used for tracking mouse movements.
	//	description:
	//		You can use this instead of a dnd library. Dojo/dnd assumes you have a
	//		node you wish to drag around, and this is not always the case.
	//		Think of a window scroll bar - you don't actually drag the handle
	//		because you can click on the bar and the handle goes to that spot.
	//	returns: Object
	//		Returns a handle with pause, resume and remove methods.
	//	event:Object
	//		This module will pass back the original DOMEvent with a mouse object
	//		attached. The mouse object contains:
	//		x/y: Float
	//			The mouse pos on the node
	//		cx/cy: Float
	//			The mouse pos on the node, constrained to not
	//			be less than zero or greater than the width/height
	//		px/py: Float
	//			Percentage of x/y position across width/height of node
	//		org: Object
	//			Contains an x/y, which is always the original position of
	//			the mousedown point.
	//		dist: Object
	//			Contains an x/y, which is the current distance from the
	//			*original* point.
	//		last: Object
	//			Contains an x/y, which is the current distance from the
	//			*last* point.
	//		type:String
	//			The type of event: zoom, down, up, move, dblclick, or click.
	//		scale:Float
	//			The amount of scale indicated by the touch gesture
	//		zoom:Boolean (or bit)
	//			A falsey switch of whether the touch event indicates a scale or
	//			zooming motion; from two fingers moving away from each other.
	//		move:Boolean (or bit)
	//			A falsey switch of whether the cursor moved
	//		down:Boolean (or bit)
	//			Whether or not the mouse is down.
	//		up:Boolean (or bit)
	//			Whether or not the mouse is up.
	//		click:Boolean (or bit)
	//			If this is a current click event (would only get fired once)
	//		dblclick:Boolean (or bit)
	//			A falsey switch of whether a double-click was detected.
	//	usage:
	//		|	mouse.track(this.node, this, 'onMouse');
	//		|	onMouse: function(evt){
	//		|		console.log(evt.mouse.dist.x);
	//		|	}
	//
	var
		log = logger('MSE', 0),
		CLICKTIME = 400,
		DBLCLICKTIME = 400,
		XTIME = 300,
		trackers = {},
		org = {},
		last = {},
		lastx,
		lasty,
		mouse,
		uidMap = {};
		
	function getUniqueId(str){
		str = str || "id";
		if(!uidMap[str]){  uidMap[str] = 0; }
		uidMap[str]++;
		return str+"_"+uidMap[str];
	
	}
	
	function clamp(num, n1, n2){
		//  Returns the number if it is inbetween the min and the max.
		//	If it is over it returns the max, if under returns the min.
		var min, max;
		if(n1 > n2){
			min = n2; max = n1;
		}else{
			min = n1; max = n2;
		}
	
		if(num < min){ return min; }
		if(num > max){ return max; }
		return num;
	}
	
	function pos( node ){
		if(node === window){
			return {
				width:window.innerWidth,
				height:window.innerHeight
			};
		}
		return node.getBoundingClientRect();
	}
	
	function Timer(){
		this.ping = function(){
			var
				pingtime = 0,
				lasttime = this.time;
				
			this.time = new Date().getTime();
			
			if(lasttime){
				pingtime = this.time - lasttime;
			}
			
			return pingtime;
		};
	}
	
	function getMousePosition(pos, rect){
		// Helper to get mouse position of a node other than
		// the target
		return {
			x: pos.x - rect.left,
			y: pos.y - rect.top,
			px: (pos.x - rect.left) / rect.width,
			py: (pos.y - rect.top) / rect.height,
			w: rect.width,
			h: rect.height
		};
	}

	function Tracker(node, callback){

		this.uid = getUniqueId('mouse');
		this.node = typeof node === 'string' ? document.getElementById(node) : node;
		//dom.selectable(node, false);
		this.begTime = 0;
		this.callback = callback;
		this.tmr = new Timer();
		this.accleration  = new Timer();


		this.init();

//        TODO
//			on(this.node, 'scroll', function(evt){
//				log('scroll', evt.scroll.x, evt.scroll.y);
//			});
	}

	Tracker.prototype = {

		onEvent: function(evt, type){
			evt.preventDefault(); // maybe only on move?
			var
				px, py, cx, cy, speedx = 0, speedy = 0,
				pos = this.getPos(evt, type),
				x = pos.x - this.box.left,
				y = pos.y - this.box.top,
				speed = this.accleration.ping();
			
			speed = Math.min(speed, XTIME);
			
			py = clamp(y / this.box.height, 0, 1);
			px = clamp(x / this.box.width, 0, 1);
			
			cx = this.box.width * px;
			cy = this.box.height * py;
			
			if(type === 'down'){
				org  = { x:x, y:y, cx:cx, cy:cy, px:px, py:py };
				last = { x:x, y:y, cx:cx, cy:cy, px:px, py:py };
			}
			
			if(type !== 'up'){
				lastx = x - last.x;
				lasty = y - last.y;
			}else if(speed < XTIME){
				if(Math.abs(lastx) > 1){
					speedx = Math.abs(lastx) * (XTIME - speed);
					speedx = Math.ceil(speedx * 0.001);
				}
			}

			evt.mouse = {
				// x/y: the mouse pos on the node
				x:x,
				y:y,

				// cx/cy: the mouse pos on the node, constrained to not
				// be less than zero or greater than the width/height
				cx: cx,
				cy: cy,

				// org: the original x/y that occurred on mousedown
				org:{
					x: org.x,
					y: org.y
				},

				// dist: the distance from the original point
				dist:{
					x: x - org.x,
					y: y - org.y
				},

				// last: distance from the point of the last move event
				last:{
					x: lastx,
					y: lasty
				},
				
				speed:{
					x: speedx,
					y: Math.abs(lasty) * (XTIME - speed),
					ping:speed
				},


				// mouse position of parent.
				// Helpful if the goal is to drag an item within a container
				// See getMousePosition for props
				parent: getMousePosition(pos, this.parentRect),

				// px/py: percentage of x/y position across width/height of node
				px:    px,
				py:		py,

				scale:(type === 'zoom') ? evt.scale : 1,

				move:	type === 'move',
				down:	type === 'down',
				up:		type === 'up',
				click:	type === 'click',
				zoom:	type === 'zoom',
				type:	type,

				dblclick:type === 'dblclick'
			};

			if(type === 'move') { last = { x:x, y:y }; }

			this.callback(evt);
		},

		onStart: function(evt){
			log('start', evt);
			var ping = this.tmr.ping();
			//console.log('beg ping:', ping);
			if(ping > 0 && ping < DBLCLICKTIME){
				this.onEvent(evt, 'dblclick');
				this.tmr.ping(true);
			}else if(ping > DBLCLICKTIME){
				this.tmr.ping(true);
			}
			
			this.parentRect = pos(this.node.parentNode);
			this.winRect = pos(window);
			this.started = 1;
			this.moved = 0;
			this.docHandle.resume();
			this.box = pos(this.node);
			this.onEvent(evt, 'down');
		},
		
		onMove: function(evt){
			evt.preventDefault();
			//log('move', evt);
			this.moved = 1;
			this.onEvent(evt, 'move');
			if(evt.clientX < 0 || evt.clientX > this.winRect.width || evt.clientY < 0 || evt.clientY > this.winRect.height){
				this.onEnd(evt);
			}
		},
		
		onEnd: function(evt){
			if(!this.started) { return; } // iphone sends cancel without click
			this.started = 0;
			log('end', evt);
			this.docHandle.pause();
			this.onEvent(evt, 'up');

			var ping = this.tmr.ping();
			//console.log('end ping:', ping);
			if(!this.moved && ping < CLICKTIME){
				this.onEvent(evt, 'click');
			}
		},
		onGestureStart: function(evt){},
		onGestureEnd: function(evt){},
		onGesture: function(evt){
			this.onEvent(evt, 'zoom');
		},
		
		init: function(){
			var h, handles;
			h = on.multi(this.node, {
				'touchstart':'onStart',
				'mousedown': 'onStart',
				'gesturechange':'onGesture',
				'gesturestart':'onGestureStart',
				'gestureend':'onGestureEnd'
			}, this);

			this.docHandle = on.multi(document, {
				'touchend':'onEnd',
				'touchcancel':'onEnd',
				'touchmove':'onMove',
				'mousemove':'onMove',
				'mouseup':'onEnd',
				'blur':'onEnd'
			}, this);
			this.docHandle.pause();

			handles = [h, this.docHandle];
			
			this.handle = {
				pause: function(){
					handles.forEach(function(h){
						h.pause();
					});
				},
				resume: function(){
					handles.forEach(function(h){
						h.resume();
					});
				},
				remove: function(){
					handles.forEach(function(h){
						h.remove();
					});
					this.tmr = null;
					this.node = null;
				}
			};

			this.getPos = function(evt, type){
				// targetTouches is an event array of touch points (you can touch
				// with more than one finger, yo)
				if(!evt.targetTouches){
					return {
						x:evt.clientX,
						y:evt.clientY
					};
				}
				// on touchend, there are no targetTouches
				if (type === 'zoom' || evt.targetTouches.length < 1) { return last; }

				// non-touch event
				// Note that this doesn't mean it is not a touch device. Android falls
				// through to here sometimes
				return {
					x:evt.targetTouches[0].clientX,
					y:evt.targetTouches[0].clientY
				};
			};
		}
	};

	mouse = {
		clamp:clamp,
		track: function(node, scope, ctx){
			var
				name,
				callbacks = {},
				callback,
				uid = getUniqueId('mouse');
			
			ctx = ctx || window;

			if ( typeof scope !== 'object') {
				callback = on.bind(ctx, scope);
			}else{
				// move, down, up, click, zoom
				for( name in scope ) {
					if (scope.hasOwnProperty(name)) {
						callbacks[name] = on.bind(ctx, scope[name]);
					}
				}
				
				callback = function(evt){
					if(evt.mouse && callbacks[evt.mouse.type]){
						callbacks[evt.mouse.type](evt);
					}
				};
			}
			
			trackers[uid] = new Tracker(node, callback);
			log('new tracker', uid, trackers[uid]);
			return trackers[uid].handle;
		}
	};

	return mouse;
});
