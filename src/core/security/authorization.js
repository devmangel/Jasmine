

class Authorization {
    constructor() {
      this.permissions = {};  // Mapa de roles a permisos
    }
  
    // Definir permisos para un rol
    defineRole(role, permissions) {
      this.permissions[role] = permissions;
    }
  
    // Middleware para verificar permisos en rutas específicas
    authorize(permission) {
      return (req, res, next) => {
        const userRole = req.user.role;
  
        if (this.permissions[userRole] && this.permissions[userRole].includes(permission)) {
          return next();  // Permiso concedido
        }
  
        return res.status(403).send({ error: 'Access denied' });  // Permiso denegado
      };
    }
  }
  
  module.exports = Authorization;
  