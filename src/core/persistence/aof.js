

const fs = require('fs');
const path = require('path');

class AOFLogger {
  constructor(database, filePath = path.join(__dirname, './data/appendonly.aof')) {
    this.database = database;
    this.filePath = filePath;
  }

  // Registrar un comando en el archivo AOF
  logCommand(command, ...args) {
    const logEntry = `${command} ${args.join(' ')}\n`;
    fs.appendFileSync(this.filePath, logEntry, 'utf8');
  }

  // Cargar y reproducir el archivo AOF para restaurar el estado
  loadAndReplay() {
    if (fs.existsSync(this.filePath)) {
      const commands = fs.readFileSync(this.filePath, 'utf8').split('\n');
      commands.forEach(commandLine => {
        if (commandLine.trim()) {
          const [command, ...args] = commandLine.split(' ');
          this.executeCommand(command, args);
        }
      });
      console.log('AOF replay completed.');
    } else {
      console.log('No AOF file found.');
    }
  }

  // Obtener la cantidad de comandos en el archivo AOF
  getCommandCount() {
    if (fs.existsSync(this.filePath)) {
      const commands = fs.readFileSync(this.filePath, 'utf8').split('\n');
      return commands.length - 1; // Restamos 1 por la línea en blanco
    }
    return 0;
  }

  // Truncar el archivo AOF después de tomar un snapshot
  truncate() {
    fs.writeFileSync(this.filePath, '', 'utf8');  // Limpiar el archivo AOF
    console.log('AOF truncado');
  }

  // Ejecutar un comando basado en el nombre y los argumentos
  executeCommand(command, args) {
    switch (command) {
      case 'SET':
        this.database.set(args[0], args[1]);
        break;
      case 'DEL':
        this.database.delete(args[0]);
        break;
      // Otros casos como LPUSH, RPUSH, SADD, etc.
      default:
        console.log(`Unknown command: ${command}`);
        break;
    }
  }
}

module.exports = AOFLogger;
