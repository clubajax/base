define([
	'./dcl',
	'./Base',
	'./lang',
	'./cache',
	'./xhr',
	'./Promise',
	'./logger'
], function(dcl, Base, lang, cache, xhr, Promise, logger){
	// Store
	// Simple Memory Store. Does not support REST functionality
	// 
	var
		Store,
		log = logger('STR', 0, 'base xhr');
	
	function cleanObject(o){
		for(var key in o){
			if(o.hasOwnProperty(key) && ( o[key] === undefined || o[key] === '' )){
				delete o[key];
			}
		}
		delete o.title;
		delete o.target;
		delete o.reports;
		delete o.charts;
		delete o.database;
		return o;
	}
	
	Store = dcl(Base, {
		declaredClass:'Store',
		
		// for development - switches to PHP page
		proxy:false,
		
		url:'',
		
		// expires: Set this to avoid fetching from the server on
		// every, same request
		// See base/core/cache for options 
		expires: false,
		
		// use an id to set this store in the registry
		id:'',
		
		// url path
		target: '',
		
		// the database name to call normally attached after the url
		database: '',
		
		// itemsProperty:
		//	The array-property-name
		//	If empty string, assumes server returns an array and
		//	not an object containing an array
		itemsProperty:'items',
		
		// valueProperty:
		// The property name that contains the value in each item
		valueProperty:'value',
		
		// idProperty:
		// The property name in each item that is its unique indentifier
		idProperty:'key',
		
		// For pagination - the keys to send for start and end
		pagingStartProp:'',
		pagingEndProp:'',
		
		// For pagination - if set, the default max results
		// (must have pagingStartProp and pagingEndProp set)
		pagingDefaultMax:0,
		
		_inflight: false,
		
		constructor: function(options){
			this.idMap = {};
			this.valueMap = {};
			this.extraParams = options.extraParams || {};
			this.readyCallbacks = [];
		},
		
		expand: function(prop){
			// adds expandable properties to query
			if(!this.extraParams.expand){ this.extraParams.expand = []; }
			if(Array.isArray(prop)){
				prop.forEach(function(p){
					this.extraParams.expand.push(p);		
				}, this);
			}else{
				this.extraParams.expand.push(prop);
			}
			
		},
		
		processResults: function(data){
			// to be over written by extending objects
			return data;
		},
		
		stashItems: function(items){
			// set items to memory for later retrieval
			if(items && items.length){
				var i, id, value;
				for(i = 0; i < items.length; i++){
					id = this.getId(items[i]);
					value = this.getValue(items[i]);
					this.idMap[id] = items[i];
					this.valueMap[value] = items[i];
				}
			}
		},
		
		byIndex: function(idx){
			var items = this.data ? this.data.length ? this.data : this.data.items : [];
			return items[idx];
		},
		
		page: function(start, end){
			if(!this.pagingStartProp || !this.pagingEndProp){
				console.error('Paging start and end properties mut be set');
			}
			var params = {};
			params[this.pagingStartProp] = start;
			params[this.pagingEndProp] = end;
			this.query(this.lastQuery, params);
		},
		
		getData: function(callback){
			// async way to get (all of the) data, in case it is
			// not yet loaded
			if(this.data){
				callback(this.data);
			}else{
				var h = this.on('data', function(data){
					callback(data);
					h.remove();
				});	
			}
		},
		
		getItems: function(callback){
			// async way to get (all of the) items, in case it is
			// not yet loaded
			if(this.items){
				callback(this.items);
			}else{
				var h = this.on('items', function(items){
					callback(items);
					h.remove();
				});	
			}
		},
		
		getId: function(item){
			return item[this.idProperty];
		},
		
		getValue: function(item){
			return item[this.valueProperty];
		},
		
		byValue: function(value){
			// There is no garauntee that values are unique
			// and return the correct item
			return this.valueMap[value];
		},
		
		byId: function(id){
			return this.idMap[id];
		},
		
		setData: function(data){
			// called when xhr resolves, but could be used
			// to programmatically set data
			// 
			console.timeEnd(this.url);
			
			this.data = data;
			this.items = !!this.itemsProperty ? data[this.itemsProperty] : data;
			this.stashItems(this.items);
			this.emit('data', data);
			this.emit('items', this.items);
			this.emit('data-end', data);
			
			this.readyStatus = true;
			this.checkReady();
		},
		
		onQuerySuccess: function(data){
			this.setData(this.processResults(data));
		},
		
		query: function(query, params, successCallback){
			
			//this.emit('data-begin');
			
			query = query || this.lastQuery || {};
			params = params || this.lastParams || {};
			
			var
				promise,
				cachePromise,
				allParams, delimeter, url,
				target = this.target || '';
			
			this.lastQuery = lang.copy(query);
			this.lastParams = lang.copy(params);
				
			if(query.target || params.target){
				target = (target + '/' + (query.target || params.target)).replace('//', '/');
			}
			
			this.database = query.database || params.database || this.database;
			if(this.database === ''){
				console.error('database not provided to Store');
			}
			
			if(this.queryAppend){
				target += this.queryAppend;
			}
			
			if(this.pagingDefaultMax && !params[this.pagingStartProp] && !params[this.pagingEndProp]){
				params[this.pagingStartProp] = 0;
				params[this.pagingEndProp] = this.pagingDefaultMax;
			}
			
			console.log('query', query);
			console.log('params', params);
			console.log('this.database', this.database);
			console.log('this.extraParams', this.extraParams);
			//console.log('target', target);
			
			allParams = cleanObject(lang.mix({}, query, params, this.extraParams));
				
			delimeter = this.url.indexOf('?') > -1 || target.indexOf('?') > -1 ? '&' : '?';
			
			url = this.url +
				(this.database ? "/" + this.database.toLowerCase() : "") + 
				(target ? target : "") +
				(!lang.empty(allParams) ? delimeter : '') +
				(allParams ? xhr.toQuery(allParams) : '');
				
			log('query', this.url, '\n\tdatabase', this.database, '\n\ttarget', this.target, '\n\tparams', allParams );
			
			url = this.checkForProxyUrl(url);
			
			console.log('URL', this.id, url);
			
			if(url === this._lastUrl && this.data){
				console.log('prevent duplicate query blocked', this.data);
				this.emit('data-begin', false);
				if(!this._inflight){
					this.setData(this.data);
				}
				promise = new Promise();
				promise.call(this.data);
				return promise;
			}
			
			this.emit('data-begin', true);
			this._lastUrl = url;
			
			console.time(this.url);
			
			// nullify data as an indication that we are in the
			// process of fetching data
			//
			this.data = null;
			this.items = null;
			this._inflight = true;
			
			this.readyStatus = false;
			
			promise = new Promise();
			
				
			cachePromise = cache(url, this.expires, null);
			
			cachePromise.then(function(data){
				this._inflight = false;
				this.onQuerySuccess(data);
				promise.resolve(this.data);
			}.bind(this), function(e){
				console.error('Store error', e);
				this._inflight = false;
				this.emit('data-end', e);
			}.bind(this));
			
			return promise;
		},
		
		ready: function(callback){
			if(this.readyStatus){
				callback();
			}else{
				this.readyCallbacks.push(callback);
			}
		},
		
		checkReady: function(){
			this.readyCallbacks.forEach(function(cb){ cb(); });
			this.readyCallbacks = [];
		},
		
		checkForProxyUrl: function(url){
			if(this.proxy){
				return this.proxy(url);
			}
			return url;
		}
	});
	
	return Store;
});