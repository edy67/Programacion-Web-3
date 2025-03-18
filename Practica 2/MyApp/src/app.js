

const express = require('express');
const path = require('path');
const dbController = require('./controllers/dbController');
const readline = require('readline');

const app = express();
const port = 3000;

// Middleware para parsear los datos en formato JSON
app.use(express.json());

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rutas para las tres consultas
app.get('/basic-query', dbController.basicQuery);
app.get('/promise-query', dbController.promiseQuery);
app.get('/pool-query', dbController.poolQuery);

// Ruta para agregar un nuevo usuario
app.post('/add-user', dbController.addUser); 

// Servir la página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Conectar a la base de datos (la misma conexión que usas en dbController)
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apli_usuarios'
});

// Configuración del readline para interactuar con la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para agregar un usuario desde la consola
const agregarUsuarioConsola = async () => {
  rl.question('Ingrese el nombre del usuario: ', async (nombre) => {
    rl.question('Ingrese el email del usuario: ', async (email) => {
      rl.question('Ingrese el teléfono del usuario: ', async (telefono) => {
        rl.question('Ingrese la dirección del usuario: ', async (direccion) => {
          const query = 'INSERT INTO usuarios (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)';
          try {
            const [result] = await connection.execute(query, [nombre, email, telefono, direccion]);
            console.log('Usuario creado exitosamente con ID:', result.insertId);
            rl.close();
          } catch (err) {
            console.error('Error al crear el usuario:', err);
            rl.close();
          }
        });
      });
    });
  });
};

// Función para eliminar un usuario desde la consola
const eliminarUsuarioConsola = async () => {
  rl.question('Ingrese el ID del usuario a eliminar: ', async (userId) => {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    try {
      const [result] = await connection.execute(query, [userId]);
      if (result.affectedRows > 0) {
        console.log('Usuario eliminado exitosamente.');
      } else {
        console.log('No se encontró un usuario con ese ID.');
      }
      rl.close();
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);
      rl.close();
    }
  });
};

// Función para actualizar un usuario desde la consola
const actualizarUsuarioConsola = async () => {
  rl.question('Ingrese el ID del usuario a actualizar: ', async (userId) => {
    rl.question('Ingrese el nuevo nombre del usuario: ', async (nombre) => {
      rl.question('Ingrese el nuevo email del usuario: ', async (email) => {
        rl.question('Ingrese el nuevo teléfono del usuario: ', async (telefono) => {
          rl.question('Ingrese la nueva dirección del usuario: ', async (direccion) => {
            const query = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?';
            try {
              const [result] = await connection.execute(query, [nombre, email, telefono, direccion, userId]);
              if (result.affectedRows > 0) {
                console.log('Usuario actualizado exitosamente.');
              } else {
                console.log('No se encontró un usuario con ese ID.');
              }
              rl.close();
            } catch (err) {
              console.error('Error al actualizar el usuario:', err);
              rl.close();
            }
          });
        });
      });
    });
  });
};

// Menú de la consola para elegir la operación
const mostrarMenu = () => {
  console.log('Seleccione una opción:');
  console.log('U. Agregar usuario');
  console.log('V. Eliminar usuario');
  console.log('T. Actualizar usuario');
  console.log('4. Salir');
  
  rl.question('Ingrese una opción: ', (opcion) => {
    switch (opcion.toUpperCase()) {
      case 'U': // Agregar usuario
        agregarUsuarioConsola();
        break;
      case 'V': // Eliminar usuario
        eliminarUsuarioConsola();
        break;
      case 'T': // Actualizar usuario
        actualizarUsuarioConsola();
        break;
      case '4': // Salir
        rl.close();
        break;
      default:
        console.log('Opción inválida. Intente nuevamente.');
        mostrarMenu();
        break;
    }
  });
};

// Llamar al menú inicial cuando el servidor esté listo
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  mostrarMenu();
});
