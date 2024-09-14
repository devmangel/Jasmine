class ContainerController {
    constructor(containerService) {
      this.containerService = containerService;
    }
  
    // Crear un contenedor
    createContainer(req, res) {
      const { containerName } = req.body;
      const username = req.user.username;  // Supone que el ID del usuario está en el token JWT
  
      try {
        const containerId = this.containerService.createContainer(username, containerName);
        res.status(201).send({ containerId });
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    }
  
    // Almacenar datos en un contenedor
    storeData(req, res) {
      const { key, value } = req.body;
      const { containerId } = req.params;
      const userId = req.user.id;
  
      try {
        this.containerService.storeDataInContainer(userId, containerId, key, value);
        res.status(200).send({ message: 'Data stored successfully' });
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    }
  
    // Obtener datos de un contenedor
    getData(req, res) {
      const { containerId, key } = req.params;
      const userId = req.user.id;
  
      try {
        const value = this.containerService.getDataFromContainer(userId, containerId, key);
        res.status(200).send({ value });
      } catch (error) {
        res.status(404).send({ error: error.message });
      }
    }
  
    // Eliminar datos de un contenedor
    deleteData(req, res) {
      const { containerId, key } = req.params;
      const userId = req.user.id;
  
      try {
        this.containerService.deleteDataFromContainer(userId, containerId, key);
        res.status(200).send({ message: 'Data deleted successfully' });
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    }
  }
  
  module.exports = ContainerController;
  