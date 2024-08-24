

const express = require('express');
const bodyParser = require('body-parser');
const HashTable = require('../data_structures/hash_table');
const PersistenceManager = require('../persistence/persistence_manager');
const Authentication = require('../security/authentication');
const Authorization = require('../security/authorization');
const SecurityManager = require('../security/security_manager');

const app = express();
const port = 3000;

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

// Ruta de autenticación
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Lógica simple de autenticación (solo como ejemplo)
  if (username === 'admin' && password === 'password') {
    const token = auth.generateToken({ username: 'admin', role: 'admin' });
    return res.status(200).send({ token });
  } else if (username === 'user' && password === 'password') {
    const token = auth.generateToken({ username: 'user', role: 'user' });
    return res.status(200).send({ token });
  }
  
  return res.status(401).send({ error: 'Invalid credentials' });
});

// Protege las rutas con el middleware de autenticación
app.use(auth.validateToken.bind(auth));  // Asegurar que todas las rutas siguientes estén autenticadas

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
app.listen(port, () => {
  console.log(`Jasmine server running on http://localhost:${port}`);
});