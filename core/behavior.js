define([
	'./on',
	'./mouse',
	'./dom',
	'./has',
	'./Promise'
], function(on, mouse, dom, has, Promise){
	
	var
		testNode = document.createElement('div'),
		testStyle = testNode.style,
		cssMap = {
			transition: 'transition',
			transform: 'transform'
		},
		remTrans = {},
		addTrans = {};
	
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
	
	Object.keys(cssMap).forEach(function(prop){
		cssMap[prop] = dashify(testCss(prop));
	});
	
	
	//addTrans[cssMap.transition] = transValue;
	remTrans[cssMap.transition] = '';
	
	function ani(node, prop, value, time){
		
		addTrans[cssMap.transition] = cssMap.transform + ' ' + time + 'ms ease-out';
		dom.style(node, addTrans);
		
		window.requestAnimationFrame(function(){
			dom.style(node, prop, value);
		});
		
		
		return {
			remove: function(){
				var
					value = dom.style(node, cssMap.transform).split(','),
					x = Number(value[4]);
				console.log('REM', x, value);
				dom.style(node, remTrans);
				
				
				dom.style(node, prop, value);
				
				return {
					x:x
				};
			}
		};
	}
	
	return {
		all: Promise.all,
		move: function(node, options){
			var
				resolved = 0,
				transform = has('transform'),
				transition = has('transition'),
				duration = options.d || options.dur || options.duration || 500,
				ease = options.ease || 'ease',
				transitionProps = transform + ' ' + duration + 'ms ' + ease,
				transformFromProps = [],
				transformToProps = [],
				promise = new Promise();
			
			if(options.callback){
				promise.then(options.callback, options.errback);
			}
				
			if(options.to.x){
				transformToProps.push('translateX(' + options.to.x +'px)');
			}
			if(options.to.y){
				transformToProps.push('translateY(' + options.to.y +'px)');
			}
			if(options.from){
				if(options.from.x){
					transformFromProps.push('translateX(' + options.from.x +'px)');
				}
				if(options.from.y){
					transformFromProps.push('translateY(' + options.from.y +'px)');
				}
				//console.log(node.id, 'FROM', transformFromProps.join(' '));
				dom.style(node, transform, transformFromProps.join(' '));
			}
			
			dom.style(node, transition, transitionProps);
			
			on.once(node, has('transitionend'), function(){
				resolved = 1;
				setTimeout(function(){
					promise.resolve();
				}, 100);
				
				if(options.resetOnFinish){
					setTimeout(function(){
						//console.log(' - trans-end', node);
						dom.style(node, transform, '');
						dom.style(node, transition, '');
					}, 100);
				}
			});
			
			setTimeout(function(){
				if(!resolved){
					console.log('unresolved transition', node);	
				}	
			}, 1000);
			
			
			//window.requestAnimationFrame does not always allow time
			//for promise to be returned
			//
			setTimeout(function(){
				dom.style(node, transform, transformToProps.join(' '));
			},200);
			
			return promise;
		},
		
		momentum: function(node, sibling){
			node = typeof node === 'string' ? document.getElementById(node) : node;
			
			window.node = node;
			window.dom = dom;
			
			var
				anihandle,
				handle,
				w,
				x = 0,
				time = 3000,
				dist = 50;
				
			handle = mouse.track(node.parentNode, function(e){
				//console.log('e', e.mouse.type, e.mouse.last.x);
				if(e.mouse.type === 'down'){
					if(anihandle){
						x = anihandle.remove().x;
					}
				}else if(e.mouse.type === 'move'){
					x += e.mouse.last.x;
					dom.style(node, cssMap.transform, 'translateX('+x+'px)');
					if(sibling){
						dom.style(sibling, cssMap.transform, 'translateX('+x+'px)');	
					}
				}else if(e.mouse.type === 'up'){
					//console.log('UP last.x', e.mouse.last.x, 'speed', e.mouse.speed.x, e.mouse.speed.ping);
					
					x += ((e.mouse.last.x > 0) ? dist : -dist) * (e.mouse.speed.x);
					//console.log('org x', x);
					if(e.mouse.speed.x > 3){
						time = 2000;
					}
					if(e.mouse.speed.x > 6){
						time = 1000;
					}
					
					w = dom.box(node.parentNode).width - dom.box(node).width;
					
					if(x > 0){
						x = 0;
						time = 500;
					}else if(x < w){
						x = w;
						time = 500;
					}
					
					//console.log('TO', x, '(',w,')');
					anihandle = ani(node, cssMap.transform, 'translateX('+x+'px)', time);
					if(sibling){
						ani(sibling, cssMap.transform, 'translateX('+x+'px)', time);
					}
				}
			});
			
			return {
				remove: function(){
					handle.remove();
					anihandle.remove();
				}
			};
		}
	};
});