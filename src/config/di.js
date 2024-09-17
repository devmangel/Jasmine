const { securityManager } = require('./security_config');
const { persistenceManager, database } = require('./persistence_config');
const { authController, containerController } = require('./repository_service_config');

module.exports = {
  authController,
  containerController,
  securityManager,
  persistenceManager,
  database
};