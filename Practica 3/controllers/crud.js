const conexion = require('../database/db');
const db = require('../database/db');
/*Obtenemos los datos del formulario haciendo
referencia a /save*/
exports.save=(req,res)=>{
    const nombre=req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio=req.body.precio;
    const cantidadStock=req.body.cantidadStock;
    conexion.query('INSERT INTO medicamento SET ?',{nombre:nombre,descripcion:descripcion,precio:precio,cantidadStock:cantidadStock},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    })
}
exports.update = (req, res) => {
    const { id, nombre, descripcion, precio, cantidadStock } = req.body;

    conexion.query(
        'UPDATE medicamento SET ? WHERE id = ?',
        [{ nombre, descripcion, precio, cantidadStock }, id],
        (error, results) => {
            if (error) {
                console.error('Error al actualizar el medicamento:', error);
                return res.status(500).send('Error al actualizar el medicamento');
            }
            res.redirect('/');
        }
    );
};
exports.delete = (req, res) => {
    const { id } = req.params;
    conexion.query('DELETE FROM medicamento WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Hubo un error al eliminar el medicamento');
        }
        res.redirect('/'); // Redirige al inicio después de eliminar
    });
};