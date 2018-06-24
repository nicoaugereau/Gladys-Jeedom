module.exports = function() {

  return gladys.param.setValue({name: 'JEEDOM_HOST', value: 'localhost'})
  .then(gladys.param.setValue({name: 'JEEDOM_PORT', value: 7072}))
  .then(function() {
    sails.log.info("Jeedom module installed successfully");
  })
  .catch(function(e) {
    sails.log.error("Failed to install Jeedom module");
  });
}
