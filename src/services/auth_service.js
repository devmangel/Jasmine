const bcrypt = require('bcrypt');

class AuthService {
  constructor(userRepository, authentication) {
    this.userRepository = userRepository;  // Inyección del repositorio de usuarios
    this.authentication = authentication;  // Para generar el token JWT
  }

  // Lógica para autenticar a un usuario
  async authenticate(username, password) {
    // Obtener al usuario desde el repositorio
    const user = this.userRepository.getUser(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada (hash)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Si la autenticación es correcta, generar un token JWT
    const token = this.authentication.generateToken({
      username: user.username,
      role: user.role || 'user',  // Asignar un rol si no se ha asignado uno
    });

    return token;
  }

  // Lógica para registrar un usuario
  async register(username, password) {
    // Verificar si el usuario ya existe
    const existingUser = this.userRepository.getUser(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hashear la contraseña y guardar el usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `pai${Date.now()}`,
      username,
      password: hashedPassword,
      containers: [],
    };

    // Guardar el usuario en el repositorio
    this.userRepository.saveUser(newUser);
    
    return newUser;
  }
}

module.exports = AuthService;
