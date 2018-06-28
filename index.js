module.exports = function(sails) {
    
    var shared = require('./lib/shared.js');
    var setup = require('./lib/setup.js');
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');


    gladys.on('ready', function(){
	return gladys.param.getValues(['JEEDOM_HOST','JEEDOM_PORT','JEEDOM_TOKEN'])
        .spread(function(host, port, token){
		shared.getApi(host, port, token);
	});
    });

    return {
	install: install,
     	setup: setup,
        exec: exec
    };
};
