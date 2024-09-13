
# Jasmine

Jasmine es una implementación ligera y eficiente de un sistema similar a Redis, diseñado para brindar soporte a estructuras de datos clave-valor con persistencia y seguridad. Esta librería está escrita en Node.js y proporciona funcionalidades clave como almacenamiento en memoria, persistencia de datos a través de snapshots (RDB) y archivos de solo anexado (AOF), y un robusto sistema de autenticación y autorización para proteger el acceso a los datos.

## Características

- **Almacenamiento en Memoria**: Soporte para tipos de datos clave-valor como strings, listas, conjuntos y conjuntos ordenados.
- **Persistencia**: Implementa persistencia con snapshots (RDB) y logs de operaciones (AOF).
- **Seguridad**: Autenticación basada en tokens (JWT) y autorización basada en roles.
- **Extensibilidad**: Modularidad que permite la fácil integración de nuevas características y clientes de persistencia.

## Requisitos

- Node.js (v12 o superior)
- NPM (v6 o superior)

## Instalación

Primero, clona el repositorio y navega a la carpeta del proyecto:

```bash
git clone https://github.com/tu_usuario/jasmine.git
cd jasmine
```

Luego, instala las dependencias:

```bash
npm install
```

## Uso

### Iniciar el Servidor

Para iniciar el servidor Jasmine en tu entorno local:

```bash
node src/index.js
```

Por defecto, el servidor se iniciará en `http://localhost:3000`.

### Autenticación

Antes de poder realizar operaciones, debes autenticarte para obtener un token JWT.

```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "admin", "password": "password"}'
```

Esto devolverá un token que debe ser usado en las cabeceras de las solicitudes subsecuentes.

### Operaciones Básicas

#### Establecer un Valor (`SET`)

```bash
curl -X POST http://localhost:3000/set -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"key": "testKey", "value": "testValue"}'
```

#### Obtener un Valor (`GET`)

```bash
curl -X GET http://localhost:3000/get/testKey -H "Authorization: Bearer YOUR_TOKEN"
```

#### Eliminar un Valor (`DEL`)

```bash
curl -X DELETE http://localhost:3000/del/testKey -H "Authorization: Bearer YOUR_TOKEN"
```

### Persistencia

Jasmine soporta dos métodos principales de persistencia:

1. **Snapshots (RDB)**: Captura el estado completo de la base de datos en intervalos regulares.
2. **Append-Only File (AOF)**: Registra cada comando de escritura en un archivo, permitiendo la recuperación completa del estado.

Ambos métodos se configuran automáticamente en el servidor y funcionan en conjunto para asegurar que los datos no se pierdan entre reinicios.

### Seguridad

#### Autenticación

Jasmine utiliza JWT (JSON Web Tokens) para autenticar las solicitudes. Los tokens se generan en la ruta `/login` y deben ser incluidos en las cabeceras de autorización para acceder a las rutas protegidas.

#### Autorización

El acceso a ciertos comandos y datos está restringido por roles. Actualmente, existen dos roles:

- **admin**: Acceso completo a todas las operaciones.
- **user**: Acceso limitado solo a operaciones de lectura (`GET`).

### Personalización

Puedes personalizar la configuración de seguridad, persistencia y otros aspectos modificando los archivos en `src/core/security/` y `src/core/persistence/`.

## Contribución

Si deseas contribuir a Jasmine, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Empuja tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo los términos de la [MIT License](LICENSE).

## Contacto

Para más información, preguntas o comentarios, puedes contactar a [devmangel](mailto:soporte@productos-ai.com).
