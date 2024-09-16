

const axios = require('axios');

class JasmineClient {
  constructor(baseURL = 'http://localhost:8010') {
    this.client = axios.create({
      baseURL,
      timeout: 1000,
    });
  }

  // Enviar una solicitud SET
  async set(key, value) {
    try {
      const response = await this.client.post('/set', { key, value });
      console.log(`SET ${key}: ${response.data.message}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Enviar una solicitud GET
  async get(key) {
    try {
      const response = await this.client.get(`/get/${key}`);
      console.log(`GET ${key}: ${response.data.value}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Enviar una solicitud DEL
  async del(key) {
    try {
      const response = await this.client.delete(`/del/${key}`);
      console.log(`DEL ${key}: ${response.data.message}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Manejo básico de errores
  handleError(error) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error(`Error: ${error.response.status} - ${error.response.data.error}`);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error: No response received from server.');
    } else {
      // Algo pasó al configurar la solicitud que desencadenó un error
      console.error('Error:', error.message);
    }
  }
}

module.exports = JasmineClient;
