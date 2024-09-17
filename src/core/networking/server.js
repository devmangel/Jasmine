const express = require('express');
const bodyParser = require('body-parser');
const { authController, containerController, securityManager, persistenceManager, database } = require('../../config/di');
const authRoutes = require('../../routes/auth_routes');
const containerRoutes = require('../../routes/container_routes');
const dataRoutes = require('../../routes/data_routes');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 8010;

// Configurar middlewares
app.use(bodyParser.json());

// Cargar rutas de autenticación
app.use(authRoutes(authController));

// Cargar rutas de contenedores
app.use(containerRoutes(containerController, persistenceManager, securityManager));

// Cargar rutas de SET, GET y DELETE
app.use(dataRoutes(database, persistenceManager, securityManager));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Jasmine server running on http://localhost:${port}`);
});
