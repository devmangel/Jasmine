

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
    this.compactionThreshold = options.compactionThreshold || 10000;  // Umbral de compacción de AOF
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

    // Revisar si es necesario realizar la compactación
    if (this.aof.getCommandCount() > this.compactionThreshold) {
      this.compactAOF();
    }
  }

  // Iniciar auto-snapshot en intervalos regulares
  startAutoSnapshot() {
    setInterval(() => {
      // this.rdb.saveSnapshot();
      this.compactAOF();  // Compactar el AOF después de cada snapshot
    }, this.snapshotInterval);
    console.log(`Auto snapshot started, interval: ${this.snapshotInterval / 1000} seconds.`);
  }

  // Compactar el archivo AOF (truncar y reducir)
  compactAOF() {
    this.rdb.saveSnapshot();  // Tomar un snapshot antes de compactar
    this.aof.truncate();  // Truncar el AOF después del snapshot
    console.log('AOF compactado después del snapshot');
  }
}

module.exports = PersistenceManager;
