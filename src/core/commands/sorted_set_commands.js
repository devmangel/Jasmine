

const BaseCommand = require('./base_command');
const HashTable = require('../data_structures/hash_table');
const SortedSet = require('../data_structures/sorted_set');

class ZAddCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = new HashTable();
  }

  execute(key, score, value) {
    try {
      let sortedSet = this.database.get(key);
      if (!sortedSet) {
        sortedSet = new SortedSet();
        this.database.set(key, sortedSet);
      }
      sortedSet.add(value, score);
      this.logExecution('ZADD', { key, score, value });
      return { success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class ZRankCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key, value) {
    try {
      const sortedSet = this.database.get(key);
      if (!sortedSet) {
        return { success: false, error: 'Key not found' };
      }
      const rank = sortedSet.rank(value);
      this.logExecution('ZRANK', { key, value });
      return rank !== -1
        ? { success: true, rank }
        : { success: false, error: 'Value not found in sorted set' };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

class ZRemCommand extends BaseCommand {
  constructor(database) {
    super();
    this.database = database;
  }

  execute(key, value) {
    try {
      const sortedSet = this.database.get(key);
      if (!sortedSet) {
        return { success: false, error: 'Key not found' };
      }
      const result = sortedSet.remove(value);
      this.logExecution('ZREM', { key, value });
      return result
        ? { success: true }
        : { success: false, error: 'Value not found or could not be removed' };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = {
  ZAddCommand,
  ZRankCommand,
  ZRemCommand,
};
