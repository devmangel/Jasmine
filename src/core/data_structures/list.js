

// Definición de un nodo en la lista enlazada
class ListNode {
    constructor(value) {
      this.value = value;
      this.next = null;  // Referencia al siguiente nodo
      this.prev = null;  // Referencia al nodo anterior (si implementamos lista doblemente enlazada)
    }
  }
  
  // Definición de la lista enlazada
  class LinkedList {
    constructor() {
      this.head = null;  // Primer nodo de la lista
      this.tail = null;  // Último nodo de la lista
      this.length = 0;   // Número de elementos en la lista
    }
  
    // Añadir un valor al final de la lista
    push(value) {
      const newNode = new ListNode(value);
  
      if (this.tail) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      } else {
        this.head = this.tail = newNode;
      }
  
      this.length++;
    }
  
    // Eliminar y devolver el último valor de la lista
    pop() {
      if (!this.tail) return null;
  
      const removedNode = this.tail;
      if (this.tail.prev) {
        this.tail = this.tail.prev;
        this.tail.next = null;
      } else {
        this.head = this.tail = null;
      }
  
      this.length--;
      return removedNode.value;
    }
  
    // Añadir un valor al principio de la lista
    unshift(value) {
      const newNode = new ListNode(value);
  
      if (this.head) {
        this.head.prev = newNode;
        newNode.next = this.head;
        this.head = newNode;
      } else {
        this.head = this.tail = newNode;
      }
  
      this.length++;
    }
  
    // Eliminar y devolver el primer valor de la lista
    shift() {
      if (!this.head) return null;
  
      const removedNode = this.head;
      if (this.head.next) {
        this.head = this.head.next;
        this.head.prev = null;
      } else {
        this.head = this.tail = null;
      }
  
      this.length--;
      return removedNode.value;
    }
  
    // Obtener el valor en una posición específica
    get(index) {
      if (index < 0 || index >= this.length) return null;
  
      let currentNode = this.head;
      let counter = 0;
  
      while (currentNode) {
        if (counter === index) {
          return currentNode.value;
        }
        currentNode = currentNode.next;
        counter++;
      }
  
      return null;
    }
  
    // Eliminar un valor en una posición específica
    remove(index) {
      if (index < 0 || index >= this.length) return null;
  
      if (index === 0) return this.shift();
      if (index === this.length - 1) return this.pop();
  
      let currentNode = this.head;
      let counter = 0;
  
      while (currentNode) {
        if (counter === index) {
          const prevNode = currentNode.prev;
          const nextNode = currentNode.next;
  
          prevNode.next = nextNode;
          if (nextNode) {
            nextNode.prev = prevNode;
          }
  
          this.length--;
          return currentNode.value;
        }
        currentNode = currentNode.next;
        counter++;
      }
  
      return null;
    }
  }
  
  module.exports = LinkedList;
  