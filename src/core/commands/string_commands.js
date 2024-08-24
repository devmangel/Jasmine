

const BaseCommand = require('./base_command');
const HashTable = require('../data_structures/hash_table');

class SetCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;  // El almacén de datos, por ejemplo, una instancia de HashTable
  }

  // Ejecuta el comando SET
  execute(key, value) {
    try {
      this.database.set(key, value);
      this.logExecution('SET', { key, value });
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class GetCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  // Ejecuta el comando GET
  execute(key) {
    try {
      const value = this.database.get(key);
      this.logExecution('GET', { key });
      return value !== null
        ? { success: true, value }
        : { success: false, error: 'Key not found' };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class DelCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  // Ejecuta el comando DEL
  execute(key) {
    try {
      const result = this.database.delete(key);
      this.logExecution('DEL', { key });
      return result
        ? { success: true }
        : { success: false, error: 'Key not found or could not be deleted' };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = {
  SetCommand,
  GetCommand,
  DelCommand,
};
