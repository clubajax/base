define([], function(dcl){
	
	// has library
	// 
	var VENDOR_PREFIXES = ["Webkit", "Moz", "O", "ms", "Khtml"],
		d = document,
		el = d.createElement("DiV"),
		testStyle = el.style,
		g = window,
		testCache = {},
		isIE = navigator.userAgent.indexOf('Trident') > -1
    ;
	
	function cap(word){
		return word.charAt(0).toUpperCase() + word.substr(1);
	}
	
	function testCss(prop){
		var
			key,
			uc = cap(prop),
			props = [
				prop,
				'Webkit' + uc,
				'Moz' + uc,
				'O' + uc,
				'ms' + uc,
				'Khtml' + uc
			];
		for(key in props){
			if(props.hasOwnProperty(key) && testStyle[props[key]] !== undefined){
				return props[key];
			}
		}
		return false;
	}
	
	function dashify(word){
		var i, dashed = '';
		for(i = 0; i < word.length; i++){
			if(word.charCodeAt(i) < 91){
				dashed += '-' + word[i].toLowerCase();
			}else{
				dashed += word[i];
			}
		}
		return dashed;
	}
	
	function has(name){
        if(typeof testCache[name] === "function"){
            testCache[name] = testCache[name](g, d, el);
        }
        return testCache[name];
    }
	
	has.add = function(name, test, now){
		testCache[name] = now ? test(g, d, el) : test;
	};
	
	has.add('transform', function(){
		return dashify(testCss('transform'));
	});
	
	
	// has custom tests
	// 
	has.add('wheel', function(win, doc, div){
        return  "onwheel" in div || "wheel" in div ||
            (isIE && doc.implementation.hasFeature("Events.wheel", "3.0")); // IE feature detection
    });

    function mouseleave(){
       var n = d.createElement('div');
       n.setAttribute('onmouseleave');
       return typeof n.onmouseleave === 'function';
    }
    has.add('mouseenter', function(){
        return mouseleave();
    });
    has.add('mouseleave', function(){
        return mouseleave();
    });
	
	return has;
});