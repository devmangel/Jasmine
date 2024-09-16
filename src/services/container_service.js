class ContainerService {
  constructor(userRepository, containerRepository) {
    this.userRepository = userRepository;
    this.containerRepository = containerRepository;
  }

  createContainer(userId, containerName) {
    const user = this.userRepository.getUserById(userId); 
    if (!user) {
      throw new Error('User not found');
    }

    const containerId = this.containerRepository.createContainer(user.userId, containerName);
    this.userRepository.updateContainers(userId, containerId);
    return containerId;
  }

  // Almacenar datos en un contenedor
  storeDataInContainer(userId, containerId, key, value) {
    const user = this.userRepository.getUserById(userId);  // Usamos username en lugar de userId
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