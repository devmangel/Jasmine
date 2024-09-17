
const Authentication = require('../core/security/authentication');
const Authorization = require('../core/security/authorization');
const SecurityManager = require('../core/security/security_manager');

// Configurar autenticación y seguridad
const auth = new Authentication('productos-ai');  // Clave secreta
const authorization = new Authorization();
const securityManager = new SecurityManager(auth, authorization);

// Definir roles y permisos
authorization.defineRole('admin', ['SET', 'GET', 'DELETE']);
authorization.defineRole('user', ['GET']);

module.exports = {
  securityManager,
  auth
};
