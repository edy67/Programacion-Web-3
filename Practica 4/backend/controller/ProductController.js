import * as Producto from "../model/ProductModel.js";

// Obtener productos
export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.obtenerTodosProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
}

// Crear producto
export const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, categoria, marca, precio, stock, talla, color } = req.body;
        const newProducto = await Producto.crearNuevoProducto(nombre, descripcion, categoria, marca, precio, stock, talla, color);
        res.status(201).json({ id: newProducto, message: 'Producto creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el Producto', error: error.message });
    }
}

// Actualizar producto
export const ActualizarNuevoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const buscar = await Producto.buscarProducto(id);
        if (!buscar) return res.status(404).json({ message: 'Producto no encontrado' });

        const { nombre, descripcion, categoria, marca, precio, stock, talla, color } = req.body;
        await Producto.ActualizarProducto(id, nombre, descripcion, categoria, marca, precio, stock, talla, color);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el Producto', error: error.message });
    }
}

// Eliminar producto
export const EliminarProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const buscar = await Producto.buscarProducto(id);
        if (!buscar) return res.status(404).json({ message: 'Producto no encontrado' });
        
        await Producto.EliminarProducto(id);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el Producto', error: error.message });
    }
}
