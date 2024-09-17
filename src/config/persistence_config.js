const HashTable = require('../core/data_structures/hash_table');
const PersistenceManager = require('../core/persistence/persistence_manager');

// Instanciar la base de datos
const database = new HashTable();

// Configurar el PersistenceManager
const persistenceManager = new PersistenceManager(database, {
  snapshotInterval: 60000,  // 60 segundos
  useAOF: true,
  aofFilePath: './data/appendonly.aof',
});
persistenceManager.initialize();

module.exports = {
  persistenceManager,
  database
};
