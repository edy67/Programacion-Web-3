const conexion = require('../database/db');
const db = require('../database/db');
/*Obtenemos los datos del formulario haciendo
referencia a /save*/
exports.save=(req,res)=>{
    const titulo=req.body.titulo;
    const autor = req.body.autor;
    const genero = req.body.genero;
    const anio_publicacion=req.body.anio_publicacion;
    
    conexion.query('INSERT INTO libros SET ?',{titulo:titulo,autor:autor,genero:genero,anio_publicacion:anio_publicacion},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    })
}
exports.update = (req, res) => {
    const { id, titulo, autor, genero, anio_publicacion } = req.body;

    conexion.query(
        'UPDATE libros SET ? WHERE id = ?',
        [{ titulo, autor, genero, anio_publicacion }, id],
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
    conexion.query('DELETE FROM libros WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Hubo un error al eliminar el medicamento');
        }
        res.redirect('/'); // Redirige al inicio después de eliminar
    });
};