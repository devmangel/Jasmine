class ContainerService {
  constructor(userRepository, containerRepository) {
    this.userRepository = userRepository;
    this.containerRepository = containerRepository;
  }

  createContainer(userId, containerName) {
    // Buscar al usuario en el repositorio de usuarios
    const user = this.userRepository.getUserById(userId); 
    if (!user) {
      throw new Error('User not found');
    }
  
    // Generar el containerId basado en el nombre del contenedor
    const containerId = `${containerName}`;
  
    // Verificar si ya existe un contenedor con el mismo containerId para este userId
    const existingContainer = this.containerRepository.getContainerById(containerId);
    if (existingContainer && existingContainer.userId === userId) {
      throw new Error(`Container with name "${containerId}" already exists`);
    }
  
    // Crear un nuevo contenedor si no existe
    const newContainerId = this.containerRepository.createContainer(user.userId, containerName);
  
    // Retornar el ID del nuevo contenedor creado
    return newContainerId;
  }  

  getContainerById(userId, containerId) {
    const user = this.userRepository.getUserById(userId); 
    if (!user) {
      throw new Error('User not found');
    }

    const container = this.containerRepository.getContainerById(containerId);
    if (!container) {
      throw new Error('Container not found or access denied');
    }
    const { userId: _, ...containerWithoutUserId } = container;

    return containerWithoutUserId;
  }

  // Almacenar datos en un contenedor
  storeDataInContainer(userId, containerId, key, value) {
    const user = this.userRepository.getUserById(userId); 
    if (!user) {
      throw new Error('User not found');
    }

    const container = this.containerRepository.getContainerById(containerId);
    if (!container) {
      throw new Error('Container not found or access denied');
    }

    if (typeof value === 'object') {
      console.log(`Value entro: ${value}`)
      value = JSON.stringify(value);
    }

    this.containerRepository.storeData(containerId, key, value);
  }

  // Obtener datos de un contenedor
  getDataFromContainer(containerId, key) {
    const container = this.containerRepository.getContainerById(containerId);
    if (!container) {
      throw new Error('Container not found or access denied');
    }

    const value = this.containerRepository.getData(containerId, key);
    if (value === null) {
      throw new Error('Key not found');
    }

    return value;
  }

  // Eliminar datos de un contenedor
  deleteDataFromContainer(containerId, key) {
    const container = this.containerRepository.getContainerById(containerId);
    if (!container) {
      throw new Error('Container not found or access denied');
    }

    this.containerRepository.deleteData(containerId, key);
  }
}

module.exports = ContainerService;