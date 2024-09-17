const UserRepository = require('../repositories/user_repository');
const ContainerRepository = require('../repositories/container_repository');
const AuthService = require('../services/auth_service');
const ContainerService = require('../services/container_service');
const AuthController = require('../controllers/auth_controller');
const ContainerController = require('../controllers/container_controller');
const { auth } = require('./security_config');

// Instanciar repositorios y servicios
const userRepository = new UserRepository();
const containerRepository = new ContainerRepository();
const authService = new AuthService(userRepository, auth);
const containerService = new ContainerService(userRepository, containerRepository);

// Instanciar controladores
const authController = new AuthController(authService);
const containerController = new ContainerController(containerService);

module.exports = {
  userRepository,
  containerRepository,
  authService,
  containerService,
  authController,
  containerController
};
