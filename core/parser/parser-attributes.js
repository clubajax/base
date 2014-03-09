define([
	'./parser'
], function(parser){
	
	var
		PROP_ATTR = 'data-props';
		
	
	function assignProps(object, propObject){
		//	currently only supports JSON or flat objects
		//	deeper nesting should be done with:
		//		JSON.parse('{' + propObject + '}');
		
		//console.log('PROPS:::', JSON.parse(json));
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
				key = props[i].split(':')[0].trim();
				value = props[i].split(':')[1].trim();
				if(value !== '' && !isNaN(Number(value))){
					value = Number(value);
				}
				object[key] = value;
			}	
		}
		
		
	}
	
	function addAttsToObject(atts, props){
		var i, a;
		for(i = 0; i < atts.length; i++){
			a = atts[i];
			if(a.localName === PROP_ATTR){
				assignProps(props, a.value);
			}else{
				props[a.localName] = a.value;
			}
		}
		return props;
	}
	
	function attsToObject(node){
		return addAttsToObject(node.attributes, {});
	}
	
	parser.plugin(function(attributes, propObject){
		if(typeof attributes === 'object' && attributes instanceof window.NamedNodeMap){
			addAttsToObject(attributes, propObject);
		}
	});
	
	return attsToObject;

});