define([
	'../../core/dcl',
	'../../core/dom',
	'../../core/Base',
	'../../core/Widget'
], function(dcl, dom, Base, Widget){

	var
		Tree,
		Folder,
		File,
		events = {
			rowClick:'row-click'
		};
	
	File = dcl(Base, {
		declaredClass:'BaseTreeFile',
		baseClass:'base-tree-row',
		iconClass:'base-tree-file',
		textClass:'base-tree-text',
		iconBuilder: null,
		constructor: function(options, node){
			//console.log('File', options);
			this.id = dom.uid('tree-file');
			this.name = options.data.name || '';
			options.data.isFile = true;
			this.iconClass = options.data.icon || this.iconClass;
			if(this.iconBuilder){
				this.iconClass += ' ' + this.iconBuilder(options.data);
			}
			this.node = dom('div', {css:this.baseClass + ' m' + options.indent}, node);
			this.iconNode = dom('span', {css:this.iconClass}, this.node);
			this.textNode = dom('span', {css:this.textClass, html: options.data.name}, this.node);
			this.data = options.data;
			this.on(this.node, 'click', function(){
				//console.log('CLICK!');
				this.emit('click-file', this);
			}, this);
			
			this.select = function(select){
				if(select){
					this.node.classList.add('select');
				}else{
					this.node.classList.remove('select');
				}
			};
		}
	});
	
	Folder = dcl(Base, {
		declaredClass:'BaseTreeFolder',
		baseClass:'open base-tree-branch',
		rowClass:'base-tree-row',
		expanderClass:'base-tree-expander',
		iconClass:'base-tree-folder',
		textClass:'base-tree-text',
		childClass: 'base-tree-child',
		iconBuilder: null,
		constructor: function(options, node){
			
			var
				eventTree = this.child();
			
			this.id = dom.uid('tree-folder');
			this.name = options.data.name || '';
			options.data.isFolder = true;
			this.iconClass = options.data.icon || this.iconClass;
			if(this.iconBuilder){
				this.iconClass += ' ' + this.iconBuilder(options.data);
			}
			this.data = options.data;
			this.items = [];
			this.isOpen = true;
			this.isSelected = false;
			this.node = dom('div', {css:this.baseClass}, node);
			
			this.rowNode = dom('div', {css:this.rowClass + ' m' + options.indent}, this.node);
			this.expanderNode = dom('span', {css:this.expanderClass}, this.rowNode);
			this.iconNode = dom('span', {css:this.iconClass}, this.rowNode);
			this.textNode = dom('span', {css:this.textClass, html: options.data.name}, this.rowNode);
			
			this.on(this.rowNode, 'click', function(){
				this.emit('click-folder', this);
			}, this);
			
			this.childNode = dom('div', {css:this.childClass}, this.node);
			
			concat(this.items, createFolders({
				data:options.data.folders,
				indent: options.indent + 1,
				eventTree: eventTree,
				iconBuilder: this.iconBuilder
			}, this.childNode));
			concat(this.items, createFiles({
				data:options.data.files,
				indent: options.indent + 1,
				eventTree: eventTree,
				iconBuilder: this.iconBuilder
			}, this.childNode));
			
			//console.log('Folder items', this.name, this.items);
		},
		toggleOpen: function(){
			if(this.isOpen){
				this.isOpen = false;
				this.node.classList.remove('open');
				this.node.classList.add('closed');
			}else{
				this.isOpen = true;
				this.node.classList.add('open');
				this.node.classList.remove('closed');
			}
		},
		
		dispose: function(){
			this.rowNode = null;
			this.expanderNode = null;
			this.iconNode = null;
			this.textNode = null;
			dom.destroy(this.node);
			this.node = null;
			this.items.length = 0;
		},
		
		select: function(select){
			this.isSelected = select;
			if(select){
				this.rowNode.classList.add('select');
				this.toggleOpen();
			}else{
				this.rowNode.classList.remove('select');
			}
		}
	});

	function createFolders(options, node){
		if(!options || !options.data){ return null; }
		
		var
			folders = Array.isArray(options.data) ? options.data : [options.data],
			folder,
			items = [];
		folders.forEach(function(data){
			options.data = data;
			folder = new Folder(options, node);
			concat(items, folder, folder.items);
		});
		return items;
	}
		
	function createFiles(options, node){
		if(!options || !options.data){ return null; }
		var
			files = Array.isArray(options.data) ? options.data : [options.data],
			items = [];
		files.forEach(function(data){
			options.data = data;
			concat(items, new File(options, node));	
		});
		return items;
	}
	
	function concat(){
		var
			args = Array.prototype.slice.call(arguments, 0),
			main = args.shift();
		
		function add(m){
			if(m.id){
				if(main[m.id]){
					return;
				}
				main[m.id] = m;
			}
			main.push(m);
		}
		args.forEach(function(item){
			if(!item){ return; }
			if(Array.isArray(item)){
				item.forEach(function(m){
					add(m);
				});
			}else{
				add(item);
			}
		});
	}
	
	Tree = dcl(Widget, {
		declaredClass:'BaseTree',
		
		baseClass:'base-tree',
		branchClass:'base-tree-branch',
		rowClass:'base-tree-row',
		containerClass:'base-tree-container',
		scrollerClass:'base-tree-scroller',
		
		// iconBuilder: if a function, is invoked, passing the item.
		// Should return a string/className
		iconBuilder: null,
		
		template:'<div class="{{baseClass}}"><div data-ref="scrollerNode" class="{{scrollerClass}}"><div data-ref="containerNode" class="{{containerClass}}"></div></div></div>',
		
		constructor: function(){
			this.items = [];
			
			this.on('click-file', function(file){
				//console.log('click-file', file);
				this.deselectAll();
				file.select(true);
			}, this);
			
			this.on('click-folder', function(file){
				//console.log('click-file', file);
				this.deselectAll();
				file.select(true);
			}, this);
		},
		//postRender: function(){
		//	//console.log('post render', this);
		//},
		
		render: function(data){
			//console.log('render', this.containerNode);
			
			this.clear();
			var eventTree = this.child();
			concat(this.items, createFolders({
				data:data.folders,
				eventTree:eventTree,
				indent:0,
				iconBuilder: this.iconBuilder
			}, this.containerNode));
			concat(this.items, createFiles({
				data:data.files,
				eventTree: eventTree,
				indent:0,
				iconBuilder: this.iconBuilder
			}, this.containerNode));

			console.log('items', this.items.length);
		},
		clear: function(){
			if(this.items.length){
				this.disposeItems();
			}
		},
		disposeItems: function(){
			this.items.forEach(function(item){
				item.dispose();
			});
			this.items.length = 0;
			this.containerNode.innerHTML = '';
		},
		deselectAll: function(){
			this.items.forEach(function(item){ item.select(false); });
		},
		dispose: function(){
			this.disposeItems();
			dom.destroy(this.node);
		}
	});
	
	return Tree;
});