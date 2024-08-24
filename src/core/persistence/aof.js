

const fs = require('fs');
const path = require('path');

class AOFLogger {
  constructor(database, filePath = path.join(__dirname, 'appendonly.aof')) {
    this.database = database;  // Instancia de HashTable
    this.filePath = filePath;  // Ruta del archivo AOF
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

  // Ejecutar un comando basado en el nombre y los argumentos
  executeCommand(command, args) {
    switch (command) {
      case 'SET':
        this.database.set(args[0], args[1]);
        break;
      case 'DEL':
        this.database.delete(args[0]);
        break;
      case 'LPUSH':
        let listLPush = this.database.get(args[0]);
        if (!listLPush) {
          listLPush = new LinkedList();
          this.database.set(args[0], listLPush);
        }
        listLPush.unshift(args[1]);
        break;
      case 'RPUSH':
        let listRPush = this.database.get(args[0]);
        if (!listRPush) {
          listRPush = new LinkedList();
          this.database.set(args[0], listRPush);
        }
        listRPush.push(args[1]);
        break;
      case 'SADD':
        let setSAdd = this.database.get(args[0]);
        if (!setSAdd) {
          setSAdd = new Set();
          this.database.set(args[0], setSAdd);
        }
        setSAdd.add(args[1]);
        break;
      case 'ZADD':
        let sortedSetZAdd = this.database.get(args[0]);
        if (!sortedSetZAdd) {
          sortedSetZAdd = new SortedSet();
          this.database.set(args[0], sortedSetZAdd);
        }
        sortedSetZAdd.add(args[2], parseFloat(args[1]));
        break;
      default:
        console.log(`Unknown command: ${command}`);
        break;
    }
  }
}

module.exports = AOFLogger;
