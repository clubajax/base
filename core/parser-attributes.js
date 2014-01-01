define([
	'./parser'
], function(parser){
	
	var
		PROP_ATTR = 'data-props';
		
	
	function assignProps(object, propObject){
		//	currently only supports flat objects
		//	deeper nesting could be done with:
		//		JSON.parse('{' + propObject + '}');
		var
		i, key, value,
		props = propObject.split(',');
	
		for(i = 0; i < props.length; i++){
			key = props[i].split(':')[0].trim();
			value = props[i].split(':')[1].trim();
			if(value !== '' && !isNaN(Number(value))){
				value = Number(value);
			}
			object[key] = value;
		}
	}
	
	function attsToObject(atts, props){
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
	
	parser.plugin(function(attributes, propObject){
		if(attributes instanceof window.NamedNodeMap){
			attsToObject(attributes, propObject);
		}
	});

});