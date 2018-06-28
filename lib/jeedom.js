var net = require('net');
var Promise = require('bluebird');

var buffer = require('./buffer.js');

var reconnectInterval;
var runInterval;
var trigger = false;

var Jeedom = function(conf) {
  this._conf = conf;
}


module.exports = function (host, port, token) {
  var conf = {
    host: host,
    port: port,
    token: token
  }
  return new Jeedom(conf);
}


Jeedom.prototype.connect = function() {
  var self = this;
  return new Promise(function(resolve, reject){ 
    trigger = net.connect({port: self._conf.port, host: self._conf.host, token: self._conf.token}, function()
    {
      sails.log.info('Connected to Jeedom server.');
      trigger.write('inform on\r\n');
      return resolve();
    });
  
    trigger.on('data', function(data)
    {
      clearInterval(reconnectInterval);
      buffer.receivedValue(data.toString().split("\n"))
    });
  
    trigger.on('error', function(error)
    {
      sails.log.warn('Could not connect to Jeedom server (host: ' + self._conf.host + ', port: ' + self._conf.port + '), retrying in 10s...');
      reconnectInterval = setTimeout(function ()
      {
        self.connect()
        .then(function() {
          return resolve();
        });
      }, 10000);
    });
  
    trigger.on('end', function()
    {
      sails.log.warn('Connection lost to Jeedom server (host: ' + self._conf.host + ', port: ' + self._conf.port + '), reconnecting in 10s...');
      reconnectInterval = setTimeout(function ()
      {
        self.connect()
        .then(function() {
          return resolve();
        });
      },10000);
    });
  });
}


Jeedom.prototype.search = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    // Open new session to prevent from sending useless data to the trigger session
    // then list devices
    var getDevice = net.connect({port: self._conf.port, host: self._conf.host, token: self._conf.token}, function()
    {    
      sails.log.info('Listing devices on Jeedom...');
      getDevice.write('list;exit\r\n');
    });
  
    var answerStr = '';
    getDevice.on('data', function(response)
    {
      answerStr += response.toString();
    });

    // Once session is closed, all devices have been pushed to answerStr
    getDevice.on('end', function()
       {
      // filter to get devices
      buffer.parseDevices(answerStr)
      .then(function(devices) {
        // send devices array back to setup function
         return resolve(devices);
      });
      getDevice.end();
      getDevice.destroy();
    });

    getDevice.on('error', function()
    {
      sails.log.warn('Failed to list devices on Jeedom ! Retrying in 10s...');
      setTimeout(function ()
      {
        self.search()
        .then(function(devices) {
          return resolve(devices);
        });    
      }, 10000);
    });
  });
}

Jeedom.prototype.command = function(device, action) {
  var self = this;
  return new Promise(function(resolve, reject){
    // Open new session to prevent from sending useless data to the trigger session
    // then prepare to run command
    var runCommand = net.connect({port: self._conf.port, host: self._conf.host, token: self._conf.token}, function()
    {
      runCommand.write('set ' + device + ' ' + action + ';exit\r\n');
      runCommand.end();
      runCommand.destroy();
      return resolve();
    });

//    var answerStr = '';
 //   runCommand.on('data', function(response)
  //  {
   //   clearInterval(runInterval);
    //  answerStr += response.toString();
 //   });

  //  runCommand.on('end', function()
   // {
    //  buffer.verifyCommandReceived(answerStr, device, action)
    //  .then(function() {
    //    runCommand.end();
    //    runCommand.destroy();
   //     return null;
    //  }) 
    //  .catch(function(err) {
    //    sails.log.warn('Failed to run Jeedom command ' + device + ' ' + action + ' ! Retrying in 1s...'); 
    //    runInterval = setTimeout(function ()
    //    {
    //      self.command(device, action);
    //    }, 10000);
    //  });
    //});

    runCommand.on('error', function()
    {
      sails.log.warn('Failed to run Jeedom command ' + device + ' ' + action + ' ! Retrying in 1s...');
      setTimeout(function ()
      {
        self.command(device, action)
        .then(function() {
          return resolve();
        });
      }, 1000);
    });
  });
}
