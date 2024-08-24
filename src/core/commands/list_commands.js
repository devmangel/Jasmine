

const BaseCommand = require('./base_command');
const HashTable = require('../data_structures/hash_table');
const LinkedList = require('../data_structures/list');

class LPushCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key, value) {
    try {
      let list = this.database.get(key);
      if (!list) {
        list = new LinkedList();
        this.database.set(key, list);
      }
      list.unshift(value);
      this.logExecution('LPUSH', { key, value });
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class RPushCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key, value) {
    try {
      let list = this.database.get(key);
      if (!list) {
        list = new LinkedList();
        this.database.set(key, list);
      }
      list.push(value);
      this.logExecution('RPUSH', { key, value });
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class LPopCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key) {
    try {
      const list = this.database.get(key);
      if (!list) {
        return { success: false, error: 'Key not found' };
      }
      const value = list.shift();
      this.logExecution('LPOP', { key });
      return value !== null
        ? { success: true, value }
        : { success: false, error: 'List is empty' };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class RPopCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key) {
    try {
      const list = this.database.get(key);
      if (!list) {
        return { success: false, error: 'Key not found' };
      }
      const value = list.pop();
      this.logExecution('RPOP', { key });
      return value !== null
        ? { success: true, value }
        : { success: false, error: 'List is empty' };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = {
  LPushCommand,
  RPushCommand,
  LPopCommand,
  RPopCommand,
};
