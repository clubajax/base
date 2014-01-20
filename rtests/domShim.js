define([], function(){
	
	var Node = function(name){
		this.nodeName = name;
		this.style = {};
		this.attributes = {};
		//this.firstChild = {}
		this.childNodes = [];
	};
	Node.prototype = {
		nodeType:1,
		setAttribute: function(key, value){
			this.attributes[key] = value;
		},
		getAttribute: function(key){
			return this.attributes[key];
		},
		childNodes:null,
		appendChild: function(node){
			if(this.childNodes.length){
				this.childNodes[this.childNodes.length-1].nextSibling = node;
				node.previousSibling = this.childNodes[this.childNodes.length-1];
			}
			this.childNodes.push(node);
			this.firstChild = this.childNodes[0];
		},
		firstChild:null,
		set innerHTML(text){
			this.html = text;
			this.appendChild(new Node('div'));
		},
		get innerHTML(){
			return this.html;
		}
	};
	
	global.document = {
		getElementById: function(id){
			return null;
		},
		createElement: function(nodeName){
			return new Node(nodeName);
		},
		body: (new Node('body'))
	};
	
	global.window = {
		getComputedStyle: function(node){
			return node ? node.style ? node.style : {} : {};
		}
	};
	
	global.navigator = {
		userAgent:'Node.js'	
	};
	
	console.log('SHIM');

});