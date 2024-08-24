

const HashTable = require('./hash_table');

class Set {
  constructor() {
    this.table = new HashTable();  // Utilizamos una tabla hash para almacenar los elementos
  }

  // Añadir un valor al conjunto
  add(value) {
    if (!this.contains(value)) {
      this.table.set(value, true);  // La clave es el valor; el valor puede ser cualquier cosa (aquí, true)
    }
  }

  // Eliminar un valor del conjunto
  remove(value) {
    this.table.delete(value);
  }

  // Verificar si un valor está en el conjunto
  contains(value) {
    return this.table.get(value) !== null;
  }

  // Devolver el número de elementos en el conjunto
  size() {
    return this.table.count;  // `count` es el número de elementos almacenados en la tabla hash
  }

  // Retornar todos los valores como un array (opcional)
  values() {
    const valuesArray = [];
    for (let i = 0; i < this.table.size; i++) {
      if (this.table.table[i] !== null) {
        valuesArray.push(this.table.table[i][0]);
      }
    }
    return valuesArray;
  }
}

module.exports = Set;
