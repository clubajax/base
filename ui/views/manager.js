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
		
	function length(){
		return Object.keys(viewMap).length;	
	}
	
	function indexViews(){
		var i;
		for(i = 0; i < viewList.length; i++){
			viewList[i].index = i;
		}
	}
	
	function index(view){
		var key, count = 0;
		for(key in viewMap){
			if(viewMap.hasOwnProperty(key)){
				if(view){
					if(viewMap[key] === view){
						return count;
					}
				}else{
					if(viewMap[key].selected){
						return count;
					}
				}
				count++;
			}
		}
		return 0;
	}
	
	function makeDraggable(view){
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
	
		console.log('selected', selected.index, selected.id);
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
		log('\nsetTransitionView', view.index, view.id);
		var
			duration = 600,
			distance = 1,
			toIndex = view.index,
			fromIndex = selected.index,
			size = dom.box(selected.node),
			x = size.width,
			moves = [],
			promise;
			
		if(toIndex === fromIndex){
			return;
		}
		
		distance = toIndex - fromIndex;
		
		log('  from idx', fromIndex, 'to', toIndex);
		Object.keys(viewMap).forEach(function(viewId, i){
			var
				v = viewMap[viewId],
				from = x * (i-fromIndex),
				to = (x * (i-fromIndex)) - x * distance;
			
			log('    idx', i);
			log('      view', viewId, from, 'to', to);
			
			
			dom.show(v.node);
			
			moves.push(behavior.move(v.node, {
				duration: duration,
				resetOnFinish:true,
				from:{
					x: from
				},
				to:{
					x: to
				}
			}));
		});
		
		promise = behavior.all(moves);
		
		promise.then(function(){
			setDisplayView(setSelected(view));
		});
	}
	
	manager = {
		add: function(vs){
			var i, view;
			if(Array.isArray(vs)){
				for(i = 0; i < vs.length; i++){
					viewMap[vs[i].id] = vs[i];
					viewList.push(vs[i]);
				}
			}else{
				viewMap[vs.id] = vs;
				viewList.push(vs);
			}
			
			indexViews();
			
			//view = this.select();
			view = setSelected(view);
			setDisplayView(view);
			if(!parent){
				parent = view.node.parentNode;
			}
		},
		
		select: function(view){
			view = typeof view === 'string' ? viewMap[view] : view;
			setTransitionView(view);
			return view;
		},
		
		reset: function(){
			setDisplayView(selected);
		}
	};
	
	return manager;
});