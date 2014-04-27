define([
	'../../core/dom',
	'../../core/has',
	'../../core/mouse',
	'../../core/behavior',
	'../../core/logger'
], function(dom, has, mouse, behavior, logger){
	
	var
		log = logger('VMN', 0, 'View Manager'),
		viewMap = {},
		viewList = [],
		selected,
		handle,
		parent,
		manager;
		
	function indexViews(){
		var i;
		for(i = 0; i < viewList.length; i++){
			viewList[i].index = i;
		}
	}
	
	function makeDraggable(view){
		return;
		console.error('.base-view-header');
		if(handle){
			handle.remove();
		}
		
		mouse.track(view.node, function(e){
			if(e.target !== view.node){
				return ; // true? don't block?
			}
			if(e.mouse.down){
				console.log('target', e.target);
			}
			else if(e.mouse.startMove){
				console.log('START MOVE!', e.target);
			}
			else if(e.mouse.move){
				console.log('MOVE!', e.mouse.dist);
			}
			else if(e.mouse.up){
				console.log('done.');
			}
		});
	}
	
	
	function setSelected(view){
		var i;
		for(i = 0; i < viewList.length; i++){
			viewList[i].selected = false;
		}
		selected = null;
		
		if(view){
			selected = view;
			view.selected = true;
		}else if(!selected){
			selected = viewList[0];
			selected.selected = true;
		}
		
		log('setSelected', selected.id);
		return selected;
	}
	
	function setDisplayView(view){
		var key;
		for(key in viewMap){
			if(viewMap.hasOwnProperty(key)){
				if(viewMap[key].selected){
					dom.show(viewMap[key].node);
					makeDraggable(viewMap[key]);
				}else{
					dom.hide(viewMap[key].node);
				}
			}
		}
		
		if(parent){
			dom.style(parent, {
				position: ''
			});
		}
	}
	
	function setTransitionView(view){
		view = typeof view === 'string' ? viewMap[view] : view;
		log('\n * setTransitionView', view.index, view.id);
		var
			duration = 600,
			direction = 1,
			toIndex = view.index,
			fromIndex = selected.index,
			size = dom.box(selected.node),
			x = size.width,
			moves = [],
			from, to;
			
		if(toIndex === fromIndex){
			return;
		}
		
		if(toIndex > fromIndex){
			direction = -1;
		}
		
		log('  from idx', fromIndex, 'to', toIndex);
		
		
		// selected
		from = 0;
		to = x * direction;
		moves.push(behavior.move(selected.node, {
			duration: duration,
			resetOnFinish:true,
			from:{ x: from },
			to:{ x: to }
		}));
		
		// next view
		from = x * direction * -1;
		to = 0;
		dom.show(view.node);
		moves.push(behavior.move(view.node, {
			duration: duration,
			resetOnFinish:true,
			from:{ x: from },
			to:{ x: to }
		}));
		
		behavior.all(moves).then(function(){
			log('done animating');
			setDisplayView(setSelected(view));
		});
	}
	
	function addView(view){
		log('addView', view.id);
		viewMap[view.id] = view;
		viewList.push(view);
		view.on('navigate', setTransitionView);
	}
	
	manager = {
		add: function(vs){
			var i, view;
			if(Array.isArray(vs)){
				for(i = 0; i < vs.length; i++){
					addView(vs[i]);
				}
			}else{
				addView(vs);
			}
			
			indexViews();
			
			view = setSelected(view);
			setDisplayView(view);
			if(!parent){
				parent = view.node.parentNode;
			}
			return view;
		},
		
		select: function(view){
			if(!this.contains(view)){
				console.error('View not found:', view);
				return null;
			}
			setTransitionView(view);
			return view;
		},
		
		contains: function(id){
			return viewMap[id];
		},
		
		byId: function(id){
			return viewMap[id];
		},
		
		reset: function(){
			setDisplayView(selected);
		}
	};
	
	return manager;
});