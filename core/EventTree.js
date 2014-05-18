	define([
	'../dcl/dcl',
	'./on'
	], function(dcl, on){
	// EventTree
	//      EventTree is a typical event emitter with additional functionality
	//      of generating child EventTrees. A child event will propogate up the tree
	//      to the original tree, but will not propogate down other branches.
	//
	//      A chain can be built by using setSource. Objects up the tree will
	//      be added.
	//
	//      See EventTree-main.js in the tests for usage.
	//      
	var
		EventTree,
		_id = 0;
	function uid(str){
		str = str || 'event-';
		return str + (_id++);
	}
	function noop(){}
	noop.name = 'noop';
	
	EventTree = dcl(null, {
	
		declaredClass:'EventTree',
		eventNames:null,
	
		constructor: function(options){
			options = options || {};
			this.id = uid('event-tree-');
			this.listeners = {};
			this.handles = {};
			this.children = {};
			this._previousEvents = {};
			if(options.events){
				this.setEventNames(options.events);
			}
			if(options.source){
				this.setSource(options.sourceName, options.source);
			}
		},
	
		setEventNames: function(events){
			this.__events = {};
			for(var key in events){
				if(events.hasOwnProperty(key)){
					this.__events[key] = events[key];
					this.__events[events[key]] = events[key];
				}
			}
		},
	
		setSource: function(name, source){
			this.sourceName = name;
			this.source = source;
			if(!name || !source){
				console.error('A name and a source must be passed');
			}
		},
	
		removeChild: function(childId){
			delete this.children[childId].eventTree;
			delete this.children[childId];
		},
	
		child: function(options){
			options = options || {};
			options.events = this.__events;
			var eventTree = new EventTree(options);
			eventTree.parent = this;
			this.children[eventTree.id] = {
				eventTree: eventTree
			};
			return eventTree;
		},
	
		missingEventName: function(name){
			console.warn('Possible incorrect event name:  emit('+name+')');
		},
		
		addHandle: function(handle){
			if(!this.listeners.own){
				this.listeners.own = [];
			}
			this.listeners.own.push(handle);
		},
	
		emit: function(name, event){
			if(this.__events && !this.__events[name]){
				this.missingEventName(name);
			}
			var
				stopBubbling,
				key,
				listeners = this.listeners[name],
				args = Array.prototype.slice.call(arguments);
	
			args.shift();
			
			this._previousEvents[name] = args;
			
			// adds ancestors to create a hierarchy
			// event may look like:
			// event = {
			//      section:{...},
			//      serie:{...},
			//      group:{...},
			//      graph:{...},
			//      possibleEventData:{...}
			//}
	
			if(this.source && typeof event === 'object'){
				event[this.sourceName] = this.source;
			}
			
			// If listener returns false, bubbling stops
			if(listeners){
				for(key in listeners){
					if(listeners.hasOwnProperty(key)){
						stopBubbling = listeners[key].apply(null, args);
						if(stopBubbling === false){
							break;
						}
					}
				}
			}
	
			if(this.parent){
				this.parent.emit.apply(this.parent, arguments);
			}
	
		},
	
		removeAll: function(){
			var
				listeners = this.listeners,
				handles = this.handles;
			Object.keys(handles).forEach(function(key){
				handles[key].remove();
			});
			Object.keys(listeners).forEach(function(key){
				delete listeners[key];
			});
			this.listeners = {};
		},
	
		once: function(name, callback, context, includeMissed){
			var handle = this.on(name, function(){
				callback.apply(context, arguments);
				handle.remove();
			}, this);	
		},
		
		on: function(name, callback, context, includeMissed){
			var
				handles = this.handles,
				handle,
				listeners = this.listeners,
				paused,
				deferredResult,
				id = uid('listener-');
			if(typeof name !== 'string' && (name instanceof window.Node || name === window)){
				handle = on.apply(null, arguments);
				// need to collect and destroy
				return handle;
			}
			if(this.__events && !this.__events[name]){
				console.warn('Possible incorrect event name:  on('+name+')');
			}
			
			if(context === true){
				includeMissed = true;
				context = false;
			}
		
			this.listeners[name] = this.listeners[name] || {};
			if(context){
				callback = callback.bind(context);
			}
	
			listeners[name][id] = callback;

			if(includeMissed && this._previousEvents[name]){
				deferredResult = this._previousEvents[name];
				setTimeout(function(){
					callback(deferredResult);
				}.bind(this), 100);
				this._previousEvents[name] = null; // so it won't fire again... I think...
			}
	
			handle = {
				id: uid('handle'),
				remove: function(){
					this.pause();
					delete listeners[name][id];
					delete handles[this.id];
					paused = noop;
				},
				pause: function(){
					paused = listeners[name][id];
					listeners[name][id] = noop;
				},
				resume: function(){
					listeners[name][id] = paused;
				}
			};
	
			handles[handle.id] = handle;
			return handle;
		},
	
		_disposeEvents: function(){
			// convenience method that can be called instead of
			// using inheritance on dispose()
			this.removeAll();
			if(this.parent){
				this.parent.removeChild(this.id);
			}
			this.events = null;
		},
	
		dispose: function(){
			this._disposeEvents();
		}
	});
	
	return EventTree;
	});
