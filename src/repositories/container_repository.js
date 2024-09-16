const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');

const CONTAINERS_FILE = path.join(__dirname, '../../data/containers.json');

class ContainerRepository {
  constructor() {
    this.containers = this.loadContainers();
  }

  // Crear un nuevo contenedor para un usuario
  createContainer(userId, containerName) {
    const containerId = `${containerName}`;  // Generar un ID único para el contenedor
    const newContainer = {
      containerId: containerId,
      userId,
      name: v4(),
      data: {}  // Contendrá los pares clave-valor
    };

    this.containers.push(newContainer);
    this.saveContainers();
    return containerId;
  }

  // Obtener un contenedor por ID (asegurarse de que pertenece al usuario)
  getContainerById(containerId) {
    console.log("Buscando contenedor con containerId:", containerId); 
  
    const container = this.containers.find(c => c.containerId === containerId) || null;
  
    if (!container) {
      console.log("Contenedor no encontrado.");
    } else {
      console.log("Contenedor encontrado:", container);
    }  
  
    return container;
  }

  // Almacenar datos en un contenedor
  storeData(containerId, key, value) {
    const container = this.getContainerById(containerId);
    if (container) {
      container.data[key] = value;
      this.saveContainers();
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
    return this.containers.find(c => c.containerId === containerId) || null;
  }
}

module.exports = ContainerRepository;
