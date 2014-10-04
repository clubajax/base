define([], function(){

    // logger is a small representation of the larger logger used in the webapi library.
    // It is designed to piggy back off of the cookies used in that.
    // Without the main logger it works fine, but does not have the cookie/saved ability.
    // logs need to be enabled in each file.
    //
    // USAGE
    //
    //  define([
    //      'localLib/logger'
    //  ], function( logger ){
    //      var
    //          log = logger('DOM', 1),
    //          warn = logger('warn', 1),
    //          special = logger('', 1),
    //          nada = logger('NAD', 0);
    //
    //
    //      log('dom nodes here'); // -> [DOM] dom nodes here
    //      warn('you are using something that is deprecated'); // -> [warn] you are using...
    //      nada('This log is off'); // ->
    //      special('This log has no prefix'); // -> This log has no prefix
    //      
    //  });
    //
    if(document && document.location){

        return function(name, enabled, options){

            var
        logger,
        cookieKey = 'logger',
        _map,
        cookies = {
            get: function(){
                var i, k, p, lg, a = document.cookie.split(';');
                //if(!_map){
                    _map = {};
                    // loop through all cookies
                    for(i = 0; i < a.length; i++){
                        // get cookie key/value
                        p = a[i].split('=');
                        // check if logs key
                        if(p[0].trim() === cookieKey){
                            lg = p[1].split(',');
                            // map all log values
                            for(k = 0; k < lg.length; k++){
                                _map[lg[k]] = 1;
                            }
                            break;
                        }
                    }
                //}
                return _map;
            },
            set: function(value){
                setTimeout(function(){console.log('cookies', getLogMap());}.bind(this), 1);
                return document.cookie = cookieKey+'='+value;
            }
        },
        getLogMap = function(){
            return cookies.get();
        },
        logs = getLogMap(),
        all = logs.ALL,
        availableLogs = {},
        display = function(){
            // display available log prefixes when using logger(); in console
            var key, a = [], desc = '';
            for(key in availableLogs){
                if(availableLogs.hasOwnProperty(key)){
                    if(typeof availableLogs[key] === 'string'){
                        if(!desc){
                            desc = '  prefixes with descriptions:\n';
                        }
                        desc += '    ' + key + ': ' + availableLogs[key] + '\n';
                    }else{
                        a.push(key);
                    }
                }
            }
            return desc + '\nprefixes without descriptions:\n' + a.join(',');
        },

        attr = function(node, prop, value){
            var key;
            if(typeof prop === 'object'){
                for(key in prop){
                    if(prop.hasOwnProperty(key)){
                        attr(node, key, prop[key]);
                    }
                }
                return null;
            }else if(value !== undefined){
                if(prop === 'text' || prop === 'html' || prop === 'innerHTML'){
                    node.innerHTML = value;
                }else{
                    node.setAttribute(prop, value);
                }
            }

            return node.getAttribute(prop);
        },

        style = function(node, prop, value){
            var key;
            if(typeof prop === 'object'){
                for(key in prop){
                    if(prop.hasOwnProperty(key)){
                        style(node, key, prop[key]);
                    }
                }
                return null;
            }else if(value !== undefined){
                node.style[prop] = value;
            }

            // TODO - if no style return box()
            return node.style[prop];
        },
        dom = function(nodeType, options, parent){

            options = options || {};
            var
                className = options.css || options.className,
                node = document.createElement(nodeType);

            if(options.html){
                node.innerHTML = options.html;
            }

            if(className){
                node.className = className;
            }

            if(options.style){
                style(node, options.style);
            }

            if(options.attr){
                attr(node, options.attr);
            }

            if(parent){
                parent.appendChild(node);
            }

            return node;
        },
        dialogBox,
        dialog = function(){
            // open a dialog box for a UI to set logs
            if(!dialogBox){
                var
                    key,
                    header,
                    h3,
                    tabLogs,
                    tabTests,
                    testPage,
                    logPage,
                    row,
                    list,
                    tests,
                    testsList,
                    container,
                    keymap = {},
                    desc,
                    listeners = [],
                    logList = [],
                    inputs = [],
                    node,
                    onClick,
                    getTestKeys = function(o, list){
                        list = list || [];
                        o = o || window.ts.testing;
                        Object.keys(o).forEach(function(key){
                            if(typeof o[key] === 'object'){
                                getTestKeys(o[key], list);
                            }else if(o[key].description !== false){
                                list.push({
                                    name:key,
                                    desc:o[key].description,
                                    params:o[key].params,
                                    fn: o[key]
                                });
                            }
                        });
                        return list;
                    };
                console.log('availableLogs', availableLogs);
                node = dialogBox = dom('div', {css:'logger-dialog'});

                header = dom('div', {css:'logger-header'}, node);
                h3 = dom('h3', {html:'Developer Tools'}, header);
                tabLogs = dom('div', {css:'logger-tab selected', html:'Logs', attr:{id:'logTab'}}, header);
                tabTests = dom('div', {css:'logger-tab', html:'Tests', attr:{id:'testTab'}}, header);
                dom('div', {css:'close'}, h3);

                logPage = dom('div', {css:'loader-page'}, node);

                dom('p', {html:'Check or uncheck the modules below to have them output their logs into the browser console.'}, logPage);
                dom('p', {css:'note', html:'The browser must be refreshed to enable logs'}, logPage);
                dom('p', {css:'note', html:'If an app is not loaded, its logs will not be in the list'}, logPage);

                dom('button', {css:'clear-all', html:'Clear All'}, logPage);

                container = dom('div', {css:'dialog-container'}, logPage);
                list = dom('div', {css:'dialog-container'}, container);

                for(key in availableLogs){
                    if(availableLogs.hasOwnProperty(key)){
                        if(typeof availableLogs[key] === 'string'){
                            desc = availableLogs[key];
                            key = key.split('-')[0];
                            if(!keymap[key]){
                                keymap[key] = 1;
                                row = dom('div', {css:'row'}, list);
                                inputs.push( dom('input', {attr:{type:'checkbox', value:key, checked:logs[key]}}, dom('label', {html:desc}, row)));

                                if(logs[key]){
                                    logList.push(key);
                                }
                            }
                        }
                    }
                }

                testPage = dom('div', {css:'loader-page', style:{display:'none'}}, node);
                dom('p', {html:'These are built-in functional tests, to test portions of the app '}, testPage);
                dom('p', {css:'note', html:'You may run the tests by clicking on the test names, but they run better and have options if done in the console with the ts.testing namespace.'}, testPage);

                container = dom('div', {css:'dialog-container'}, testPage);
                testsList = dom('div', {css:'dialog-container'}, container);

                tests = getTestKeys();

                tests.forEach(function(test){
                    var
                        node = dom('div', {css:'logger-test-item'}, testsList),
                        nameNode = dom('div', {css:'test-name', html:test.name, attr:{'data-fn':test.fn}}, node);
                    console.log(nameNode.addEventListener('click', test.fn, false));
                    listeners.push({n:nameNode, f:test.fn});
                    if(test.desc){
                        dom('div', {css:'test-desc', html:test.desc}, node);
                    }
                    if(test.params){
                        test.params.forEach(function(param){
                            dom('div', {css:'test-param', html:param}, node);
                        });

                    }
                });

                onClick = function(e){
                    if(e.target.className === 'close'){
                        listeners.forEach(function(h){
                            h.n.removeEventListener('click', h.f, false);
                        });
                        node.removeEventListener('click', onClick, false);
                        document.body.removeChild(dialogBox);
                        dialogBox = null;
                    }
                    else if(e.target.className === 'clear-all'){
                        logList = [];
                        inputs.forEach(function(input){ input.checked = false; });
                        window.logger(0);
                    }
                    else if(e.target.nodeName === 'INPUT'){

                        logList.push(e.target.value);
                        console.log(window.logger(logList.join(',')));

                    }
                    else if(e.target.id === 'logTab'){
                        testPage.style.display = 'none';
                        logPage.style.display = 'block';
                        tabLogs.classList.add('selected');
                        tabTests.classList.remove('selected');
                    }
                    else if(e.target.id === 'testTab'){
                        testPage.style.display = 'block';
                        logPage.style.display = 'none';
                        tabLogs.classList.remove('selected');
                        tabTests.classList.add('selected');
                    }
                };

                node.addEventListener('click', onClick, false);
            }
            document.body.appendChild(dialogBox);
        };

    window.logger = function(arg, refresh){
        console.log('common.logger');
        if(arg === false || arg === 0){
            cookies.set(0);
            if(refresh){ window.location.reload(); }
        }
        else if(arg && arg.toUpperCase() === 'ALL'){
            all = true;
            cookies.set('ALL');
            if(refresh){ window.location.reload(); }
        }
        else if(arg && arg === 'chart'){
            cookies.set('CVML,ADP,PGM');
            if(refresh){ window.location.reload(); }
        }
        else if(arg){
            cookies.set(arg.toUpperCase());
            if(refresh){ window.location.reload(); }
        }
        else{
            console.log('To show the Log/Tests dialog, use: console.dialog();');
            console.log('To enable logging of all modules, use:\n\tlogger("ALL");\n'+
                        'To enable logging of one module, use logger() with the module prefix:\n\tlogger("FOO");\n'+
                        'To enable logging of multiple modules, use comma-delineated prefixes: \n\tlogger("FOO,BAR,ZAP");\n'+
                        'To turn logging off, use:\n\tlogger(false);\n\n' +
                        '' + display());
        }
    };

    window.logger.dialog = dialog;

    logger = function(name, enabled, options){

        var
            log,
            sendToConsole,
            noop = function(){},
            coop = function(method){
                return function(){
                    console[method].apply(console, arguments);
                };
            },
            nonNum = name.replace(/\-\d+|_\d+|\d+/, '').toUpperCase(),
            desc = 1;

        if(typeof options === 'string'){
            desc = options;
        }

        availableLogs[nonNum] = desc;

        // could also test config here...
        if(!all && !logs[nonNum] && (enabled === false || enabled === 0)) {
            log = function(){};
            log.enabled = false;
            log.error = noop;
            log.warn = noop;
            log.clear = noop;
            log.time = noop;
            log.timeEnd = noop;

            return log;
        }

        sendToConsole = function(args, type){
            type = type || 'log';
            if(name) { args.unshift(" ["+name+"] "); }
            // prints to console. Could obviously be sent to the server, written
            // to a log file, etc.
            console[type].apply(console, args);
        };

        log = function(){
            sendToConsole(Array.prototype.slice.call(arguments));
        };

        log.error = function(){
            sendToConsole(Array.prototype.slice.call(arguments), 'error');
        };

        log.warn = function(){
            sendToConsole(Array.prototype.slice.call(arguments), 'warn');
        };

        log.time = coop('time');
        log.timeEnd = coop('timeEnd');
        log.clear = coop('clear');

        log.enabled = true;

        console.log('enabled::: common.log', name);

        return log;
    }else{
        // for tests
        return function(){
            return function(){};
        };
    }
});

