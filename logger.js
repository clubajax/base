define([], function(){

    // USAGE
    //
    //  define([
    //      'base/logger'
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

        var
            _map,
            cookies = {
                get: function(){
                    var i, k, p, lg, a = document.cookie.split(';');
                    if(!_map){
                        _map = {};
                        // loop through all cookies
                        for(i = 0; i < a.length; i++){
                            // get cookie key/value
                            p = a[i].split('=');
                            // check if logs key
                            if(p[0].trim() === 'logs'){
                                lg = p[1].split(',');
                                // map all log values
                                for(k = 0; k < lg.length; k++){
                                    _map[lg[k]] = 1;
                                }
                                break;
                            }
                        }
                    }
                    return _map;
                },
                set: function(key, value){
                    document.cookie = key+'='+value;
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
                        }
                        a.push(key);
                    }
                }
                return desc + '\nAll available prefixes:\n' + a.join(',');
            };

        window.logger = function(arg, refresh){

            if(arg === false || arg === 0){
                cookies.set('logs', 0);
                if(refresh){ window.location.reload(); }
            }
            else if(arg && arg.toUpperCase() === 'ALL'){
                all = true;
                cookies.set('logs', 'ALL');
                if(refresh){ window.location.reload(); }
            }
            else if(arg){
                cookies.set('logs', arg);
                if(refresh){ window.location.reload(); }
            }
            else{
                console.log('To enable logging of all modules, use:\n\tlogger("ALL");\n'+
                            'To enable logging of one module, use logger() with the module prefix:\n\tlogger("FOO");\n'+
                            'To enable logging of multiple modules, use comma-delineated prefixes: \n\tlogger("FOO,BAR,ZAP");\n'+
                            'To turn logging off, use:\n\tlogger(false);\n\n' +
                            '', display());
            }
        };



        return function(name, enabled, options){

            var
                nonNum = name.replace(/\-\d+|_\d+|\d+/, ''),
                desc = 1;

            if(typeof options === 'string'){
                desc = options;
            }

            availableLogs[nonNum] = desc;
            
            // could also test config here...
            if(!all && !logs[nonNum] && (enabled === false || enabled === 0)) { return function(){}; }
            return function(){
                var args = Array.prototype.slice.call(arguments);
                if(name) { args.unshift(" ["+name+"] "); }
                // prints to console. Could obviously be sent to the server, written
                // to a log fle, etc.
                console.log.apply(console, args);
            };
        };
    }else{
        // for tests
        return function(){
            return function(){ };
        };
    }
});
