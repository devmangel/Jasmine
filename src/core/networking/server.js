

const express = require('express');
const bodyParser = require('body-parser');
const HashTable = require('../data_structures/hash_table');
const PersistenceManager = require('../persistence/persistence_manager');
const Authentication = require('../security/authentication');
const Authorization = require('../security/authorization');
const SecurityManager = require('../security/security_manager');
const UserRepository = require('../../repositories/user_repository');
const AuthService = require('../../services/auth_service');
const AuthController = require('../../controllers/auth_controller');
const ContainerController = require('../../controllers/container_controller');
const ContainerRepository = require('../../repositories/container_repository');
const ContainerService = require('../../services/container_service');

const app = express();

// Configurar middlewares
app.use(bodyParser.json());

// Crear una única instancia de la base de datos
const database = new HashTable();

// Configurar y inicializar el PersistenceManager
const persistenceManager = new PersistenceManager(database, {
  snapshotInterval: 60000,  // 60 segundos
  useAOF: true,
  aofFilePath: './appendonly.aof',
});
persistenceManager.initialize();


// Configurar autenticación
const auth = new Authentication('productos-ai');  // Clave secreta

// Configurar autorización
const authorization = new Authorization();

// Definir roles y permisos
authorization.defineRole('admin', ['SET', 'GET', 'DELETE']);
authorization.defineRole('user', ['GET']);

// Configurar el SecurityManager
const securityManager = new SecurityManager(auth, authorization);

// Crear instancias de repositorio, servicio y controlador
const userRepository = new UserRepository();
const containerRepository = new ContainerRepository();
const authService = new AuthService(userRepository, auth);
const authController = new AuthController(authService);

app.post('/register', (req, res) => authController.register(req, res));
app.post('/login', (req, res) => authController.login(req, res));


// Protege las rutas con el middleware de autenticación
app.use(auth.validateToken.bind(auth)); 

const containerService = new ContainerService(userRepository, containerRepository);
const containerController = new ContainerController(containerService);

// Rutas para la gestión de contenedores
app.post('/containers', (req, res) => containerController.createContainer(req, res));
app.post('/containers/:containerId/data', (req, res) => containerController.storeData(req, res));
app.get('/containers/:containerId/data/:key', (req, res) => containerController.getData(req, res));
app.delete('/containers/:containerId/data/:key', (req, res) => containerController.deleteData(req, res));


// Ruta para SET (solo admin)
app.post('/set', securityManager.secure('SET'), (req, res) => {
  const { key, value } = req.body;
  database.set(key, value);
  persistenceManager.logCommand('SET', key, value);  // Registrar el comando
  res.status(200).send({ message: 'OK' });
});

// Ruta para GET (admin y user)
app.get('/get/:key', securityManager.secure('GET'), (req, res) => {
  const key = req.params.key;
  const value = database.get(key);
  if (value !== null) {
    res.status(200).send({ value });
  } else {
    res.status(404).send({ error: 'Key not found' });
  }
});

// Ruta para DEL (solo admin)
app.delete('/del/:key', securityManager.secure('DELETE'), (req, res) => {
  const key = req.params.key;
  database.delete(key);
  persistenceManager.logCommand('DELETE', key);  // Registrar el comando
  res.status(200).send({ message: 'Deleted' });
});

// Iniciar el servidor
app.listen(process.env.PORT || 3500, () => {
  console.log(`Jasmine server running on http://localhost:${port}`);
});