const fs = require('fs');
const path = require('path');

const CONTAINERS_FILE = path.join(__dirname, '../../data/containers.json');
const AOF_FILE = path.join(__dirname, '../../data/containers.aof');

class ContainerRepository {
  constructor() {
    this.containers = this.loadContainers();
  }

  // Crear un nuevo contenedor para un usuario
  createContainer(userId, containerName) {
    const containerId = `${containerName}`;
    const newContainer = {
      containerId: containerId,
      userId,
      data: {}, // Contendrá los pares clave-valor
    };

    this.containers.push(newContainer);
    this.saveContainers();
    this.logAOF('CREATE', containerId, userId);
    return containerId;
  }

  // Obtener un contenedor por ID (asegurarse de que pertenece al usuario)
  getContainerById(containerId) {
    const container = this.containers.find(c => c.containerId === containerId) || null;
    return container;
  }

  // Almacenar datos en un contenedor
  storeData(containerId, key, value) {
    const container = this.getContainerById(containerId);
    if (container) {
      container.data[key] = value;
      this.saveContainers();
      this.logAOF('SET', containerId, key, value);
    }
  }

  // Obtener datos de un contenedor
  getData(containerId, key) {
    const container = this.getContainerById(containerId);
    return container ? container.data[key] || null : null;
  }

  // Eliminar datos de un contenedor
  deleteData(containerId, key) {
    const container = this.getContainerById(containerId);
    if (container && container.data[key]) {
      delete container.data[key];
      this.saveContainers();
      this.logAOF('DELETE', containerId, key);
    }
  }

  // Guardar todos los contenedores en el archivo JSON
  saveContainers() {
    fs.writeFileSync(
      CONTAINERS_FILE,
      JSON.stringify({ containers: this.containers }, null, 2)
    );
  }

  // Cargar los contenedores desde el archivo JSON
  loadContainers() {
    if (fs.existsSync(CONTAINERS_FILE)) {
      const data = fs.readFileSync(CONTAINERS_FILE);
      const jsonData = JSON.parse(data);
      return jsonData.containers || [];
    }
    return [];
  }

  // Log de operaciones de escritura en el archivo AOF
  logAOF(command, containerId, key = null, value = null) {
    const logEntry = JSON.stringify({ command, containerId, key, value }) + '\n';
    fs.appendFileSync(AOF_FILE, logEntry);
  }

  // Reproducir el archivo AOF para restaurar el estado
  replayAOF() {
    if (fs.existsSync(AOF_FILE)) {
      const logs = fs.readFileSync(AOF_FILE, 'utf8').split('\n').filter(Boolean);
      logs.forEach(logEntry => {
        const { command, containerId, key, value } = JSON.parse(logEntry);
        if (command === 'CREATE') {
          this.createContainer(containerId, value);
        } else if (command === 'SET') {
          this.storeData(containerId, key, value);
        } else if (command === 'DELETE') {
          this.deleteData(containerId, key);
        }
      });
      console.log('AOF replay completed for containers.');
    }
  }

  // Método para inicializar contenedores y reproducir AOF
  initialize() {
    this.loadContainers();  // Cargar el estado desde el archivo JSON
    this.replayAOF();  // Reproducir los comandos del AOF
  }
}

module.exports = ContainerRepository;