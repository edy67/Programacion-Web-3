const express = require('express');
const path = require('path');
const dbController = require('./controllers/dbController');
const readline = require('readline');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de consulta
app.get('/basic-query', dbController.basicQuery);
app.get('/promise-query', dbController.promiseQuery);
app.get('/pool-query', dbController.poolQuery);
app.post('/add-user', dbController.addUser);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Crear conexiones a la BD
const connectionPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apli_usuarios'
});

async function iniciarConexion() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apli_usuarios'
  });
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const actualizarUsuarioConsola = async () => {
  const connectionDirecta = await iniciarConexion(); 

  rl.question('Ingrese el ID del usuario a actualizar: ', async (userId) => {
    rl.question('Ingrese el nuevo nombre del usuario: ', async (nombre) => {
      rl.question('Ingrese la nueva edad del usuario: ', async (edad) => {
        rl.question('Ingrese el nuevo email del usuario: ', async (email) => {
          rl.question('Ingrese el nuevo teléfono del usuario: ', async (telefono) => {
            rl.question('Ingrese la nueva dirección del usuario: ', async (direccion) => {
              const query = 'UPDATE usuarios SET nombre = ?, edad = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?';

              try {
                
                const [resultExecute] = await connectionPool.execute(query, [nombre, edad, email, telefono, direccion, userId]);
                const [array] = await connectionPool.query('SELECT * FROM usuarios');


                
                const [resultQueryPool] = await connectionPool.query(query, [nombre, edad, email, telefono, direccion, userId]);

                
                const [resultQueryDirect] = await connectionDirecta.query(query, [nombre, edad, email, telefono, direccion, userId]);

                console.log('Usuario actualizado exitosamente.',array);

                connectionDirecta.end(); 
                rl.close();
              } catch (err) {
                console.error('Error al actualizar el usuario:', err);
                connectionDirecta.end();
                rl.close();
              }
            });
          });
        });
      });
    });
  });
};
// **Menú interactivo**
const mostrarMenu = () => {
  console.log('Seleccione una opción:');
  console.log('U. Agregar usuario');
  console.log('V. Eliminar usuario');
  console.log('T. Actualizar usuario');
  console.log('4. Salir');

  rl.question('Ingrese una opción: ', (opcion) => {
    switch (opcion.toUpperCase()) {
      case 'U':
        agregarUsuarioConsola();
        break;
      case 'V':
        eliminarUsuarioConsola();
        break;
      case 'T':
        actualizarUsuarioConsola();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Opción inválida. Intente nuevamente.');
        mostrarMenu();
        break;
    }
  });
};

// **Iniciar servidor**
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  mostrarMenu();
});
