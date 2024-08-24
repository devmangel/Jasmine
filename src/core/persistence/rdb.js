

const fs = require('fs');
const path = require('path');

class RDBPersistence {
  constructor(database, storageClient = null) {
    this.database = database;  // Instancia de HashTable
    this.storageClient = storageClient;  // Cliente de almacenamiento (por ejemplo, DynamoDB)
    this.snapshotFile = path.join(__dirname, 'snapshot.rdb');  // Archivo local por defecto
  }

  // Guardar el estado completo de la base de datos (Snapshot)
  async saveSnapshot() {
    const data = JSON.stringify(this.database.table);

    if (this.storageClient) {
      // Si hay un cliente de almacenamiento, utilizarlo (por ejemplo, DynamoDB)
      await this.storageClient.save(data);
      console.log('Snapshot saved to external storage.');
    } else {
      // Guardar el snapshot en un archivo local
      fs.writeFileSync(this.snapshotFile, data);
      console.log('Snapshot saved locally.');
    }
  }

  // Cargar el estado de la base de datos desde un Snapshot
  async loadSnapshot() {
    if (this.storageClient) {
      // Cargar desde almacenamiento externo
      const data = await this.storageClient.load();
      if (data) {
        this.database.table = JSON.parse(data);
        console.log('Snapshot loaded from external storage.');
      }
    } else if (fs.existsSync(this.snapshotFile)) {
      // Cargar desde un archivo local
      const data = fs.readFileSync(this.snapshotFile);
      this.database.table = JSON.parse(data);
      console.log('Snapshot loaded from local file.');
    } else {
      console.log('No snapshot found.');
    }
  }

  // Configurar la toma de snapshots en intervalos regulares
  startAutoSnapshot(interval = 60000) {  // Por defecto, cada 60 segundos
    setInterval(() => {
      this.saveSnapshot();
    }, interval);
    console.log(`Auto snapshot started, interval: ${interval / 1000} seconds.`);
  }
}

module.exports = RDBPersistence;
