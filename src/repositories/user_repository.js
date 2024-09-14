// src/repositories/user_repository.js

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');  // Ajustar ruta si es necesario

class UserRepository {
  constructor() {
    this.users = this.loadUsers();
  }

  // Obtener un usuario por nombre de usuario
  getUser(username) {
    return this.users.find(user => user.username === username) || null;
  }

  getUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  // Guardar un nuevo usuario en el archivo JSON
  saveUser(newUser) {
    this.users.push(newUser);
    this.saveUsers();
  }

  // Guardar los usuarios actualizados en el archivo JSON
  saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: this.users }, null, 2));
  }

  // Cargar los usuarios del archivo JSON
  loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE);
      const jsonData = JSON.parse(data);
      return jsonData.users || [];
    }
    return [];
  }
}

module.exports = UserRepository;