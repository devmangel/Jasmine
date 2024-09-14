const fs = require('fs');
const path = require('path');

const CONTAINERS_FILE = path.join(__dirname, '../data/containers.json');

class ContainerRepository {
  constructor() {
    this.containers = this.loadContainers();
  }

  // Crear un nuevo contenedor para un usuario
  createContainer(userId, containerName) {
    const containerId = `container_${Date.now()}`;  // Generar un ID único para el contenedor
    const newContainer = {
      id: containerId,
      userId,
      name: containerName,
      data: {}  // Contendrá los pares clave-valor
    };

    this.containers.push(newContainer);
    this.saveContainers();
    return containerId;
  }

  // Obtener un contenedor por ID (asegurarse de que pertenece al usuario)
  getContainerById(userId, containerId) {
    return this.containers.find(c => c.id === containerId && c.userId === userId) || null;
  }

  // Almacenar datos en un contenedor
  storeData(containerId, key, value) {
    const container = this.getContainer(containerId);
    if (container) {
      container.data[key] = value;
      this.saveContainers();
    }
  }

  // Obtener datos de un contenedor
  getData(containerId, key) {
    const container = this.getContainer(containerId);
    return container ? container.data[key] || null : null;
  }

  // Eliminar datos de un contenedor
  deleteData(containerId, key) {
    const container = this.getContainer(containerId);
    if (container && container.data[key]) {
      delete container.data[key];
      this.saveContainers();
    }
  }

  // Guardar todos los contenedores en el archivo JSON
  saveContainers() {
    fs.writeFileSync(CONTAINERS_FILE, JSON.stringify({ containers: this.containers }, null, 2));
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

  // Obtener un contenedor por ID
  getContainer(containerId) {
    return this.containers.find(c => c.id === containerId) || null;
  }
}

module.exports = ContainerRepository;
