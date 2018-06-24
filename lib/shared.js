var Promise = require('bluebird');
var Jeedom = require('./jeedom.js');

var api = null;

module.exports = {
  getApi: function(host, port){
	return new Promise(function(resolve, reject){
		if(api) return resolve(api);
		api = new Jeedom(host, port);
		api.connect();
		resolve(api);
        });
  }    
};
