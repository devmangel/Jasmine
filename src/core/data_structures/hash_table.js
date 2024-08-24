

class HashTable {
    constructor(size = 50) {
      this.table = new Array(size).fill(null);
      this.size = size;
      this.count = 0; // Contador de elementos en la tabla
    }
  
    // Función hash simple para generar un índice
    hash(key) {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash += key.charCodeAt(i);
      }
      return hash % this.size;
    }
  
    // Función para encontrar un índice válido usando linear probing
    findSlot(key, isInsert = false) {
      let index = this.hash(key);
  
      // Linear probing en caso de colisión
      while (this.table[index] !== null) {
        if (this.table[index][0] === key) {
          return index; // Se encuentra la clave
        }
        index = (index + 1) % this.size; // Pasar al siguiente índice
        if (!isInsert && this.table[index] === null) break; // Parar si no es para insertar
      }
      return index;
    }
  
    // Método para insertar o actualizar un par clave-valor
    set(key, value) {
      const index = this.findSlot(key, true);
  
      if (this.table[index] === null) {
        this.count++;
      }
      this.table[index] = [key, value];
  
      // Opcional: Considerar redimensionar la tabla si está muy llena
      // if (this.count >= this.size * 0.7) {
      //   this.rehash();
      // }
    }
  
    // Método para obtener un valor basado en una clave
    get(key) {
      const index = this.findSlot(key);
  
      if (this.table[index] !== null && this.table[index][0] === key) {
        return this.table[index][1];
      }
      return null; // Clave no encontrada
    }
  
    // Método para eliminar un par clave-valor
    delete(key) {
      const index = this.findSlot(key);
  
      if (this.table[index] !== null && this.table[index][0] === key) {
        this.table[index] = null;
        this.count--;
        return true;
      }
      return false;
    }
  
    // Método opcional para redimensionar la tabla (Rehashing)
    rehash() {
      const oldTable = this.table;
      this.size = this.size * 2;
      this.table = new Array(this.size).fill(null);
      this.count = 0;
  
      oldTable.forEach(entry => {
        if (entry !== null) {
          this.set(entry[0], entry[1]); // Reinsertar las entradas en la nueva tabla
        }
      });
    }
  }
  
  module.exports = HashTable;
  