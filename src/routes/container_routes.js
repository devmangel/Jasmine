const express = require("express");
const router = express.Router();

module.exports = (containerController, persistenceManager, securityManager) => {
  if (!securityManager) {
    throw new Error('securityManager no fue proporcionado correctamente.');
  }

  // Middleware de autenticación
  router.use(securityManager.secure());

  // Crear un contenedor
  router.post("/containers", async (req, res) => {
    const { userId, containerName } = req.body;

    try {
      const containerId = await containerController.createContainer(req, res);
      // Log del comando 'CREATE' en el AOF
      // persistenceManager.logCommand('CREATE_CONTAINER', containerId);
      res.status(201).send({ containerId });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  // Almacenar datos en un contenedor
  router.post("/containers/:containerId/data", async (req, res) => {
    const { containerId } = req.params;
    const { key, value } = req.body;

    try {
      await containerController.storeData(req, res);
      // Log del comando 'SET' en el AOF
      // persistenceManager.logCommand('SET_DATA_CONTAINER', containerId, key, value);
      return res.status(200).json({ message: 'Data stored successfully.' });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  // Obtener datos de un contenedor
  router.get("/containers/:containerId/data/:key", async (req, res) => {
    const { containerId, key} = req.params;
    try {
      const data = await containerController.getData(req, res);
      // persistenceManager.logCommand('GET_DATA_CONTAINER', containerId, key);
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  // Obtener un contenedor por ID
  router.get("/containers/:containerId", async (req, res) => {
    try {
      const container = await containerController.getContainer(req, res);
      // persistenceManager.logCommand('GET_CONTAINER', container);
      res.status(200).json({ container });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  // Eliminar datos de un contenedor
  router.delete("/containers/:containerId/data/:key", async (req, res) => {
    const { containerId, key } = req.params;

    try {
      await containerController.deleteData(req, res);
      // Log del comando 'DELETE' en el AOF
      // persistenceManager.logCommand('DELETE_CONTAINER', containerId, key);
      res.status(200).json({ message: 'Data deleted successfully.' });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

  return router;
};
