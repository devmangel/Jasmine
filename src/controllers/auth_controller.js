class AuthController {
    constructor(authService) {
      this.authService = authService;  // Inyección del servicio de autenticación
    }
  
    // Método para manejar el login
    async login(req, res) {
      const { email, password } = req.body;
  
      try {
        const token = await this.authService.authenticate(email, password);
        res.status(200).send({ token });
      } catch (error) {
        res.status(401).send({ error: error.message });
      }
    }
  
    // Método para manejar el registro
    async register(req, res) {
      const { email, password } = req.body;
  
      try {
        const newUser = await this.authService.register(email, password);
        const token = await this.authService.authenticate(email, password)
        res.status(201).send({ message: 'User registered successfully', token: token });
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    }
  }
  
  module.exports = AuthController;