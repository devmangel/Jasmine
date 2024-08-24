

const RDBPersistence = require('./rdb');
const AOFLogger = require('./aof');

class PersistenceManager {
  constructor(database, options = {}) {
    this.database = database;
    this.rdb = new RDBPersistence(database, options.storageClient);
    this.aof = new AOFLogger(database, options.aofFilePath);

    // Configuraciones de persistencia
    this.snapshotInterval = options.snapshotInterval || 60000;  // Intervalo de snapshot en ms (por defecto, 60s)
    this.useAOF = options.useAOF !== undefined ? options.useAOF : true;  // Habilitar o no AOF
  }

  // Iniciar el proceso de persistencia
  async initialize() {
    // Cargar estado inicial
    await this.rdb.loadSnapshot();
    this.aof.loadAndReplay();

    // Iniciar auto-snapshot si está habilitado
    this.startAutoSnapshot();
  }

  // Registrar un comando de escritura
  logCommand(command, ...args) {
    if (this.useAOF) {
      this.aof.logCommand(command, ...args);
    }
  }

  // Iniciar auto-snapshot en intervalos regulares
  startAutoSnapshot() {
    setInterval(() => {
      this.rdb.saveSnapshot();
    }, this.snapshotInterval);
    console.log(`Auto snapshot started, interval: ${this.snapshotInterval / 1000} seconds.`);
  }
}

module.exports = PersistenceManager;
