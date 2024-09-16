// src/core/security/authentication.js

const jwt = require('jsonwebtoken');

class Authentication {
  constructor(secretKey, tokenExpiry = '24h') {
    this.secretKey = secretKey;  // Clave secreta para firmar los tokens
    this.tokenExpiry = tokenExpiry;  // Tiempo de expiración del token
  }

  // Generar un token para un usuario autenticado
  generateToken(user) {
    const payload = {
      userId: user.userId,
    };
  
    // Condicional para definir el token sin expiración para "pai_admin"
    const options = user.userId === 'pai_admin' ? {} : { expiresIn: this.tokenExpiry };
  
    return jwt.sign(payload, this.secretKey, options);
  }

  // Middleware para validar un token en cada solicitud
  validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];  // El formato es "Bearer TOKEN"
    if (!token) {
      return res.status(401).send({ error: 'No token provided' });
    }

    jwt.verify(token, this.secretKey, (err, user) => {
      if (err) {
        return res.status(403).send({ error: 'Invalid token' });
      }
      req.user = user;  // Añadir el usuario a la solicitud para uso posterior
      next();
    });
  }

  // Middleware opcional para roles específicos
  requireRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).send({ error: 'Access denied' });
      }
      next();
    };
  }
}

module.exports = Authentication;
