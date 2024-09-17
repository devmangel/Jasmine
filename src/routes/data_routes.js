
const express = require('express');
const router = express.Router();

module.exports = (database, persistenceManager, securityManager) => {
  // Ruta para SET (solo admin)
  router.post('/set', securityManager.secure('SET'), (req, res) => {
    const { key, value } = req.body;
    database.set(key, value);
    persistenceManager.logCommand('SET', key, value);  // Registrar el comando
    res.status(200).send({ message: 'OK' });
  });

  // Ruta para GET (admin y user)
  router.get('/get/:key', securityManager.secure('GET'), (req, res) => {
    const key = req.params.key;
    const value = database.get(key);
    if (value !== null) {
      res.status(200).send({ value });
    } else {
      res.status(404).send({ error: 'Key not found' });
    }
  });

  // Ruta para DELETE (solo admin)
  router.delete('/del/:key', securityManager.secure('DELETE'), (req, res) => {
    const key = req.params.key;
    database.delete(key);
    persistenceManager.logCommand('DELETE', key);  
    res.status(200).send({ message: 'Deleted' });
  });

  return router;
};
