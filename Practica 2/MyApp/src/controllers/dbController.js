const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

// Conexión básica con mysql (no es promesa)
const basicConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Sin contraseña
  database: 'apli_usuarios'
});

// Función de consulta básica
const basicQuery = (req, res) => {
  const start = Date.now(); // Captura el tiempo al inicio
  console.time('basicQuery');
  
  basicConnection.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en la consulta');
      return;
    }
    const end = Date.now(); // Captura el tiempo después de la consulta
    const elapsed = end - start; // Calcula el tiempo transcurrido

    console.timeEnd('basicQuery');
    res.json({
      time: `${elapsed} ms`, // Agrega el tiempo calculado en la respuesta
      data: results
    });
  });
};

// Conexión con Promesas (utilizando createPool)
const promisePool = mysqlPromise.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Sin contraseña
  database: 'apli_usuarios',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función de consulta con promesas
const promiseQuery = async (req, res) => {
  const start = Date.now(); // Captura el tiempo al inicio
  console.time('promiseQuery');
  
  try {
    const [rows] = await promisePool.execute('SELECT * FROM usuarios');
    const end = Date.now(); // Captura el tiempo después de la consulta
    const elapsed = end - start; // Calcula el tiempo transcurrido

    console.timeEnd('promiseQuery');
    res.json({
      time: `${elapsed} ms`, // Agrega el tiempo calculado en la respuesta
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en la consulta');
  }
};

// Función de consulta con Pooling
const poolQuery = async (req, res) => {
  const start = Date.now(); // Captura el tiempo al inicio
  console.time('poolQuery');
  
  try {
    const [rows] = await promisePool.execute('SELECT * FROM usuarios');
    const end = Date.now(); // Captura el tiempo después de la consulta
    const elapsed = end - start; // Calcula el tiempo transcurrido

    console.timeEnd('poolQuery');
    res.json({
      time: `${elapsed} ms`, // Agrega el tiempo calculado en la respuesta
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en la consulta');
  }
};


// Función para insertar un usuario en la base de datos
const addUser = async (req, res) => {
  const { nombre, email, telefono, direccion } = req.body; // Obtener los datos del formulario

  const query = 'INSERT INTO usuarios (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)';
  
  try {
    const [result] = await promisePool.execute(query, [nombre, email, telefono, direccion]);
    res.json({
      message: 'Usuario creado exitosamente',
      id: result.insertId,  // Devolver el ID del nuevo usuario insertado
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al insertar el usuario');
  }
};

module.exports = {
  basicQuery,
  promiseQuery,
  poolQuery,
  addUser,  // Asegurarse de exportar la nueva función
};
