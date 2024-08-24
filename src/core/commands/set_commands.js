

const BaseCommand = require('./base_command');
const HashTable = require('../data_structures/hash_table');
const Set = require('../data_structures/set');

class SAddCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key, value) {
    try {
      let set = this.database.get(key);
      if (!set) {
        set = new Set();
        this.database.set(key, set);
      }
      set.add(value);
      this.logExecution('SADD', { key, value });
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class SRemCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key, value) {
    try {
      const set = this.database.get(key);
      if (!set) {
        return { success: false, error: 'Key not found' };
      }
      set.remove(value);
      this.logExecution('SREM', { key, value });
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class SMembersCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key) {
    try {
      const set = this.database.get(key);
      if (!set) {
        return { success: false, error: 'Key not found' };
      }
      const members = set.values();
      this.logExecution('SMEMBERS', { key });
      return { success: true, members };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = {
  SAddCommand,
  SRemCommand,
  SMembersCommand,
};
