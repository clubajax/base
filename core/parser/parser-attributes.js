define([
	'./parser'
], function(parser){
	
	var
		PROP_ATTR = 'data-props';
		
	
	function assignProps(object, propObject){
		//	currently only supports JSON or flat objects
		//	deeper nesting should be done with:
		//		JSON.parse('{' + propObject + '}');
		
		var
		i, key, value,
		parsedJson,
		props = propObject.split(',');
	
		if(propObject.indexOf('{') === 0){
			parsedJson = JSON.parse(propObject);
			for(key in parsedJson){
				if(parsedJson.hasOwnProperty(key)){
					object[key] = parsedJson[key];
				}
			}	
		}else{
			for(i = 0; i < props.length; i++){
				if(props[i].indexOf(':') > -1){
					key = props[i].split(':')[0].trim();
					value = props[i].split(':')[1].trim();
					if(value !== '' && !isNaN(Number(value))){
						value = Number(value);
					}
					object[key] = value;
				}
			}	
		}
		
		
	}
	
	function addAttsToObject(atts, props){
		var i, a;
		for(i = 0; i < atts.length; i++){
			a = atts[i];
			if(a.localName === PROP_ATTR){
				assignProps(props, a.localValue || a.value); // weird. Node vs Browser.
			}else{
				props[a.localName] = a.localValue || a.value;
			}
		}
		return props;
	}
	
	function attsToObject(node){
		return addAttsToObject(node.attributes, {});
	}
	
	parser.plugin(function(attributes, propObject){
		if(!!window.NamedNodeMap){
			if(typeof attributes === 'object' && attributes instanceof window.NamedNodeMap){
				addAttsToObject(attributes, propObject);
			}
		}else{
			// for tests
			if(Array.isArray(attributes)){
				addAttsToObject(attributes, propObject);
			}
		}
	});
	
	return attsToObject;

});