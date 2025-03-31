// Importa el módulo 'express' para crear un servidor web.
const express = require('express');
const bodyParser = require('body-parser');
// Crea una instancia de la aplicación Express.
const principal = express();

/*principal.get('/',(req,res)=>{
   res.send('hola'); 
})*/

//-----------------1------
//motor de plantilla facilita creacion de contenido html
principal.set('view engine', 'ejs');

// Middleware para parsear el cuerpo de las solicitudes
principal.use(bodyParser.json()); // Para parsear JSON
principal.use(bodyParser.urlencoded({ extended: true })); // Para parsear formularios URL-encoded

// Define las rutas
principal.use('/', require('./router'));

//crear carpeta views-----2-------
//crear carpeta database-----3-------
//crear archivo db.js y en views igual-----4-------
//crear el archivo router.js------5----
//hacer codigo en reouter.js para la rutas----6--
// poner module.exports=router; y ir a principal.js
//principal.use('/',require('./router')); poner esto
//nos vamos a database para hacer la conexion a la base de datos
//crear la base de datos
//exportamos el modulo de db.js y nos vamos a routes.js hacer el SELECT FROM

// Inicia el servidor y lo hace escuchar en el puerto 5000.
principal.listen(5000, () => {
    // Este callback se ejecuta cuando el servidor se inicia correctamente.
    console.log('SERVER CORRIENDO EN http://localhost:5000');
});

