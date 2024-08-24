

class SortedSet {
    constructor() {
      this.items = [];  // Array para almacenar los elementos en orden
    }
  
    // Añadir un valor al conjunto ordenado
    add(value, score) {
      const newItem = { value, score };
      if (this.items.length === 0) {
        this.items.push(newItem);
        return;
      }
  
      // Buscar la posición correcta para insertar (manteniendo el array ordenado)
      let inserted = false;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].score > score) {
          this.items.splice(i, 0, newItem);
          inserted = true;
          break;
        } else if (this.items[i].score === score && this.items[i].value === value) {
          // Si ya existe un elemento con el mismo score y value, no hacer nada
          return;
        }
      }
  
      // Si no se ha insertado, añadir al final
      if (!inserted) {
        this.items.push(newItem);
      }
    }
  
    // Eliminar un valor del conjunto ordenado
    remove(value) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].value === value) {
          this.items.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  
    // Obtener el rango (posición) de un valor en el conjunto ordenado
    rank(value) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].value === value) {
          return i;
        }
      }
      return -1;  // Retornar -1 si el valor no se encuentra
    }
  
    // Obtener el tamaño del conjunto ordenado
    size() {
      return this.items.length;
    }
  
    // Obtener todos los elementos del conjunto ordenado
    values() {
      return this.items.map(item => item.value);
    }
  
    // Obtener el elemento en una posición específica (por rango)
    at(rank) {
      if (rank < 0 || rank >= this.items.length) {
        return null;
      }
      return this.items[rank];
    }
  }
  
  module.exports = SortedSet;
  