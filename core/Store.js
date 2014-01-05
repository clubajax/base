define([
	'dcl/dcl',
	'./Base',
	'./lang',
	'./xhr',
	'./logger'
], function(dcl, Base, lang, xhr, logger){
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
		
		// for development - tests domain for whether this
		// shoudl use a proxy or not
		testForProxy:false,
		
		url:'',
		
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
		
		constructor: function(options){
			this.idMap = {};
			this.valueMap = {};
			if(this.testForProxy){
				if(/\d+\.\d+\.\d+\.\d+/.test(location.host) || /mikewilcox/.test(location.host)){
					this.proxy = true;
				}
			}
		},
		
		processResults: function(data){
			// to be over written by extending objects
			return data;
		},
		
		storeItems: function(items){
			var i, id, value;
			for(i = 0; i < items.length; i++){
				id = this.getId(items[i]);
				value = this.getValue(items[i]);
				this.idMap[id] = items[i];
				this.valueMap[value] = items[i];
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
		
		onResults: function(data){
			console.timeEnd(this.url);
			data = this.processResults(data);
			//console.log('Store data:', JSON.stringify(data));
			//console.log('Store data:', data);
			this.emit('data', data);
			this.emit('data-end', data);
			this.data = data;
			
			this.items = !!this.itemsProperty ? data[this.itemsProperty] : data;
			this.storeItems(this.items);
			this.emit('items', this.items);
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
		
		query: function(query, params, successCallback){
			this.emit('data-begin');
			
			query = query || this.lastQuery || {};
			params = params || this.lastParams || {};
			
			var
				allParams, delimeter, url,
				target = this.target || '';
			
			this.lastQuery = lang.copy(query);
			this.lastParams = lang.copy(params);
				
			if(query.target){
				target = (target + '/' + query.target).replace('//', '/');
			}
			
			if(!this.database){
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
			console.log('this.extraParams', this.extraParams);
			console.log('target', target);
			
			
			
			allParams = cleanObject(lang.mix({}, query, params, this.extraParams));
				
			delimeter = this.url.indexOf('?') > -1 || target.indexOf('?') > -1 ? '&' : '?';
			
			url = this.url +
				(this.database ? "/" + this.database.toLowerCase() : "") + 
				(target ? target : "") +
				(!lang.empty(allParams) ? delimeter : '') +
				(allParams ? xhr.toQuery(allParams) : '');
				
			log('query', this.url, '\n\tdatabase', this.database, '\n\ttarget', this.target, '\n\tparams', allParams );
			
			console.time(this.url);
			
			xhr.get(url, {
				proxy:this.proxy,
				callback: this.onResults.bind(this),
				errback: function(e){
					console.error('Store error', e);
					this.emit('data-end', e);
				}.bind(this)
			});
		}
	});
	
	return Store;
});