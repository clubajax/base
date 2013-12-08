define([], function(dcl){
	
	// has library
	// 
	var VENDOR_PREFIXES = ["Webkit", "Moz", "O", "ms", "Khtml"],
		d = document,
		el = d.createElement("DiV"),
		testCache = {},
		isIE = navigator.userAgent.indexOf('Trident') > -1
    ;
	
	function has(name){
        if(typeof testCache[name] == "function"){
            testCache[name] = testCache[name](g, d, el);
        }
        return testCache[name];
    }
	
	has.add = function(name, test, now){
		testCache[name] = now ? test(g, d, el) : test;
	};
	
	
	
	
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