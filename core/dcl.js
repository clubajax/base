define([
	'base/dcl/dcl',
	'./registry'
], function(dcl, registry){
	console.log('DCL!!!!!!!!!');
	var wrapped = function(parentClasses, childClass){
		var
			i,
			declaredClass,
			CompiledClass = dcl(parentClasses, childClass);
		
		if(childClass.declaredClass){
			declaredClass = childClass.declaredClass;
		}else if(Array.isArray(parentClasses)){
			for(i = parentClasses.length - 1; i >= 0 ; i--){ // reverse precidence
				if(parentClasses[i].declaredClass){
					declaredClass = childClass.parentClasses[i];
				}	
			}
		}else if(parentClasses && typeof parentClasses === 'object'){
			if(parentClasses.declaredClass){
				declaredClass = childClass.parentClasses;
			}	
		}
		
		if(declaredClass){
			registry.addClass(declaredClass, CompiledClass);
		}
		return CompiledClass;
	};
	
	wrapped.after = dcl.after;
	wrapped.before= dcl.before;
	wrapped.around = dcl.around;
	
	return wrapped;
});