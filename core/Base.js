define([
	'dcl/dcl',
	'./on',
	'./Evented',
	'./observable'
], function(dcl, on, Evented, observable){

	return dcl(Evented, {
		declaredClass:'Base',
		constructor: function(options, n){
			options = options || {};
			//console.log('base!', n);
			var
				tempDispose,
				oldDispose,
				handles = [],
				prop,
				observables = options.observables ||  this.observables || {};
			
			for(prop in options){
				if(options.hasOwnProperty(prop)){
					console.log('prop', prop);
					if(this[prop] !== undefined && observables[prop] !== undefined){
						console.error('Property assignment conflict with observable assignment:', prop);
					}
					else if(this[prop] !== undefined){
						this[prop] = options[prop];
					}
					else if(observables[prop] !== undefined){
						this[prop] = observable(options[prop]);
						//delete observables[prop];
					}
				}
			}
			
			for(prop in observables){
				if(this[prop] !== undefined && observables[prop] !== undefined){
					console.error('Property conflict with observable namespace:', prop);
				}
				else if(observables.hasOwnProperty(prop)){
					this[prop] = observable(observables[prop]);
				}
			}
			
			// NOTE:
			// don't delete this.observables or its props or it removes it from future prototypes
			//delete this.observables;
			
			this.own = function(handle){
				handles.push(handle);
			};
			
			
			tempDispose = function(){
				on.remove(handles);
			}.bind(this);
			
			if(this.dispose){
				oldDispose = this.dispose;
				this.dispose = function(){
					oldDispose();
					tempDispose();
				};
			}else{
				this.dispose = tempDispose;
			}
		}
	});
});