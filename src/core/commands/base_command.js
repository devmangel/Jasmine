

class BaseCommand {
    constructor() {
      // Inicialización común para todos los comandos, si es necesario
    }
  
    // Método para ejecutar el comando
    // Este método debe ser sobreescrito por las clases derivadas
    execute(...args) {
      throw new Error('Execute method must be implemented by subclasses');
    }
  
    // Método para manejar errores de manera uniforme
    handleError(error) {
      console.error(`Error executing command: ${error.message}`);
      return { success: false, error: error.message };
    }
  
    // Método opcional para logging
    logExecution(commandName, args) {
      console.log(`Executing command: ${commandName} with arguments: ${JSON.stringify(args)}`);
    }
  }
  
  module.exports = BaseCommand;
  