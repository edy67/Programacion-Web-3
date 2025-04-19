import pool from "../config/bd.js";

// Obtener todos los productos
export const obtenerTodosProductos = async () => {
    const [array] = await pool.query('SELECT * FROM productod');
    return array;
}

// Crear nuevo producto
export const crearNuevoProducto = async (nombre, descripcion, categoria, marca, precio, stock, talla, color) => {
    const [resultado] = await pool.query(
        'INSERT INTO productod (nombre, descripcion, categoria, marca, precio, stock, talla, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [nombre, descripcion, categoria, marca, precio, stock, talla, color]
    );
    return resultado.insertId;
}

// Actualizar producto
export const ActualizarProducto = async (id, nombre, descripcion, categoria, marca, precio, stock, talla, color) => {
    await pool.query(
        'UPDATE productod SET nombre = ?, descripcion = ?, categoria = ?, marca = ?, precio = ?, stock = ?, talla = ?, color = ? WHERE id = ?',
        [nombre, descripcion, categoria, marca, precio, stock, talla, color, id]
    );
}

// Buscar producto
export const buscarProducto = async (id) => {
    const [array] = await pool.query('SELECT * FROM productod WHERE id = ?', [id]);
    return array[0];
}

// Eliminar producto
export const EliminarProducto = async (id) => {
    await pool.query('DELETE FROM productod WHERE id = ?', [id]);
}
