

class SecurityManager {
    constructor(authentication, authorization) {
      this.authentication = authentication;
      this.authorization = authorization;
    }
  
    // Middleware para autenticar y autorizar una solicitud
    secure(permission = null) {
      return (req, res, next) => {
        // Primero, validar el token de autenticación
        this.authentication.validateToken(req, res, (authError) => {
          if (authError) return;
  
          // Luego, verificar la autorización (si se requiere un permiso específico)
          if (permission) {
            this.authorization.authorize(permission)(req, res, next);
          } else {
            next();  // Si no se requiere un permiso específico, continuar
          }
        });
      };
    }
  }
  
  module.exports = SecurityManager;
  