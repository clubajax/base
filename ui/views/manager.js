define([
	'../../core/dom',
	'../../core/mouse'
], function(dom, mouse){
	
	var
		views = {},
		selected,
		handle,
		manager;
	
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
	
	
	function getSelected(view){
		var key;
		selected = null;
		if(view){
			selected = view;
			view.selected = true;
		}else{
			for(key in views){
				if(views.hasOwnProperty(key)){
					if(views[key].selected){
						selected = views[key];
						break;
					}	
				}
			}
			if(!selected){
				for(key in views){
					if(views.hasOwnProperty(key)){
						views[key].selected = true;
						selected = views[key];
						break;
					}
				}
			}
		}
		
		return selected;
	}
	
	function setSelected(view){
		var key;
		for(key in views){
			if(views.hasOwnProperty(key)){
				if(views[key].selected){
					dom.show(views[key].node);
					makeDraggable(views[key]);
				}else{
					dom.hide(views[key].node);
				}
			}
		}
	}
	
	manager = {
		add: function(vs){
			var i;
			if(Array.isArray(vs)){
				for(i = 0; i < vs.length; i++){
					console.log('view:', vs[i]);
					views[vs[i].id] = vs[i];
				}
			}else{
				views[vs.id] = vs;
			}
			
			this.select();
		},
		
		select: function(view){
			view = getSelected(view);
			setSelected(view);
		}
	};
	
	return manager;
});