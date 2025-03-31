const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'farmacia'
});
 conexion.connect((error) =>{
    if(error){
        console.error('El error de coonexion es: '+error);
        return;
    }
    console.log('Conectado a la BD Mysql')
 });
  module.exports = conexion;
