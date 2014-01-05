define([
], function(){
	//	convenience library for common DOM methods
	//		dom()
	//			create dom nodes
	//		dom.style()
	//			set/get node style
	//		dom.attr()
	//			set/get attributes
	//		dom.destroy()
	//			obliterates a node
	//		dom.box()
	//			get node dimensions
	//		dom.uid()
	//			get a unique ID (not dom specific)
	//
	var
		isDimension = {
			width:1,
			height:1,
			top:1,
			left:1,
			right:1,
			bottom:1,
			maxWidth:1,
			'max-width':1,
			maxHeight:1,
			'max-height':1,
			minWidth:1,
			'min-width':1,
			minHeight:1,
			'min-height':1
		},
		uids = {},
		destroyer = document.createElement('div');
	
	//function notNull(item){
	//    return item !== null && item !== undefined;
	//}
	//
	//function isObject(item){
	//    // Dates, nodes, arrays, and the window will fail this test
	//    return typeof item === 'object' && Object.prototype.toString.call(item) === '[object Object]';
	//}

	function uid(type){
		if(!uids[type]){
			uids[type] = [];
		}
		var id = type + '_' + (uids[type].length + 1);
		uids[type].push(id);
		return id;
	}

	function isNode(item){
		return (/HTML/).test(Object.prototype.toString.call( item ));
	}
	
	function byId(id){
		return document.getElementById(id);
	}

	function getNode(item){
		// de-jqueryify
		if(!item){ return item; }
		return item.get ? item.get(0) : item;
	}

	function style(node, prop, value){
		// get/set node style(s)
		//      prop: string or object
		//
		var key;
		if(typeof prop === 'object'){
			for(key in prop){
				if(prop.hasOwnProperty(key)){
					style(node, key, prop[key]);
				}
			}
			return {};
		}else if(value !== undefined){
			if(typeof value === 'number' && isDimension[prop]){
				value += 'px';
			}
			
			//prop = propMap[prop] || prop;
			
			node.style[prop] = value;
	
			if(prop === 'userSelect'){
				style(node, {
					webkitTouchCallout: 'none',
					webkitUserSelect: 'none',
					khtmlUserSelect: 'none',
					mozUserSelect: 'none',
					msUserSelect: 'none'
				});
			}
			return null;
		}else if(value === undefined){
			return window.getComputedStyle(node)[prop];
		}
	
		return node.style[prop];
	}

	function attr(node, prop, value){
		// get/set node attribute(s)
		//      prop: string or object
		//
		var key, i, attribute, attrs, attsObject;
		if(typeof prop === 'object'){
			for(key in prop){
				if(prop.hasOwnProperty(key)){
					attr(node, key, prop[key]);
				}
			}
			return null;
		}else if(value !== undefined){
			if(prop === 'text' || prop === 'html' || prop === 'innerHTML'){
				node.innerHTML = value;
			}else{
				node.setAttribute(prop, value);
			}
		}else if(prop === undefined){
			// get all attrs
			attrs = node.attributes;
			attsObject = {};
			for (i = 0; i < attrs.length; i++){
				attribute = attrs.item(i);
				attsObject[attribute.nodeName] = attribute.nodeValue;
			}
			return attsObject;
		}
		
		// get single attribute
		return node.getAttribute(prop);
	}

	function box(node){
		if(node === window){
			return {
				width: node.innerWidth,
				height: node.innerHeight
			};
		}
		// get node dimensions
		return getNode(node).getBoundingClientRect();
	}
	
	function toDom(html, parent){
		// create a node from an HTML string
		destroyer.innerHTML = html;
		if(parent){
			while(destroyer.firstChild){
				parent.appendChild(destroyer.firstChild);
			}
			return parent.firstChild;
		}
		return destroyer.firstChild;
	}

	function dom(nodeType, options, parent, prepend){
		// create a node
		// if first argument is a string and starts with <, it is assumed
		// to use toDom, and creates a node from HTML. Optional second arg is
		// parent to append to
		// else:
		//		nodeType: string, type of node to create
		//		options: object with style, className, or attr properties
		//			(can also be objects)
		//		parent: Node, optional node to append to
		//		prepend: truthy, to append node as the first child
		//
		if(nodeType.indexOf('<') === 0){
			return toDom(nodeType, options, parent, prepend);
		}
		
		if(nodeType.indexOf('#') === 0){
			return byId(nodeType.substring(1));
		}
			
		options = options || {};
		var
			className = options.css || options.className,
			node = document.createElement(nodeType);
	
		parent = getNode(parent);
	
		if(className){
			node.className = className;
		}
	
		if(options.cssText){
			node.style.cssText = options.cssText;
		}
	
		if(options.style){
			style(node, options.style);
		}
	
		if(options.attr){
			attr(node, options.attr);
		}
		
		if(options.html){
			node.innerHTML = options.html;
		}
	
		if(parent && isNode(parent)){
			if(prepend && parent.hasChildNodes()){
				parent.insertBefore(node, parent.children[0]);
			}else{
				parent.appendChild(node);
			}
		}
	
		return node;
	}
	
	function destroy(node){
		// destroys a node completely
		// 
		destroyer.appendChild(node);
		destroyer.innerHTML = '';
	}
	
	function show(node){
		if(node){
			getNode(node).classList.remove('off');
		}
	}
	
	function hide(node){
		if(node){
			getNode(node).classList.add('off');
		}
	}
	
	dom.attr = attr;
	dom.box = box;
	dom.style = style;
	dom.destroy = destroy;
	dom.uid = uid;
	dom.show = show;
	dom.hide = hide;
	dom.byId = byId;
	
	return dom;
});
