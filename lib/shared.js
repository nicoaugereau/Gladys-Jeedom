var Promise = require('bluebird');
var Jeedom = require('./jeedom.js');

var api = null;

module.exports = {
  getApi: function(host, port, token){
	return new Promise(function(resolve, reject){
		if(api) return resolve(api);
		api = new Jeedom(host, port, token);
		api.connect();
		resolve(api);
        });
  }    
};
