define([
	'dcl/dcl',
	'./Base',
	'./lang',
	'./xhr',
	'./logger'
], function(dcl, Base, lang, xhr, logger){
	
	var
		Store,
		log = logger('XHR', 1, 'base xhr');
	
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
		
		idProperty:'id',
		
		url:'',
		
		// url path
		target: '',
		
		// the database name to call normally attached after the url
		database: '',
		
		constructor: function(options){
			console.log('Store', options);
		},
		
		processResults: function(data){
			// to be over written by extending objects
			return data;
		},
		
		byIndex: function(idx){
			var items = this.data ? this.data.length ? this.data : this.data.items : [];
			return items[idx];
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
				callback: function(data){
					console.timeEnd(this.url);
					data = this.processResults(data);
					console.log('Store data:', data);
					this.emit('data', data);
					this.emit('data-end', data);
					this.data = data;
				}.bind(this),
				errback: function(e){
					console.error('Store error', e);
					this.emit('data-end', e);
				}.bind(this)
			});
		}
	});
	
	return Store;
});