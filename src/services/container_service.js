class ContainerService {
  constructor(userRepository, containerRepository) {
    this.userRepository = userRepository;
    this.containerRepository = containerRepository;
  }

  createContainer(username, containerName) {
    const user = this.userRepository.getUser(username); 
    if (!user) {
      throw new Error('User not found');
    }

    const containerId = this.containerRepository.createContainer(user.username, containerName);
    return containerId;
  }

  // Almacenar datos en un contenedor
  storeDataInContainer(username, containerId, key, value) {
    const user = this.userRepository.getUser(username);  // Usamos username en lugar de userId
    if (!user) {
      throw new Error('User not found');
    }

    const container = this.containerRepository.getContainerById(user.username, containerId);
    if (!container) {
      throw new Error('Container not found or access denied');
    }

    this.containerRepository.storeData(containerId, key, value);
  }

  // Obtener datos de un contenedor
  getDataFromContainer(username, containerId, key) {
    const container = this.containerRepository.getContainerById(username, containerId);
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
  deleteDataFromContainer(username, containerId, key) {
    const container = this.containerRepository.getContainerById(username, containerId);
    if (!container) {
      throw new Error('Container not found or access denied');
    }

    this.containerRepository.deleteData(containerId, key);
  }
}

module.exports = ContainerService;