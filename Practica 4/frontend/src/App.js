import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import { useCallback, useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";


function App() {
  const [productos, setProductos] = useState([]);
  const [formularioAgregar, SetAgregarProducto] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    marca: '',
    precio: '',
    stock: '',
    talla: '',
    color: ''
  });

  const [formularioEditar, SetEditarProducto] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    marca: '',
    precio: '',
    stock: '',
    talla: '',
    color: ''
  });

  const [productoId, setProductoId] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [mostrar, setMostrar] = useState(false);
  const CerrarModal = () => {
    setMostrar(false);
    
    SetEditarProducto({
      nombre: '',
      descripcion: '',
      categoria: '',
      marca: '',
      precio: '',
      stock: '',
      talla: '',
      color: ''
    });
  };
  const AbrirModal = () => setMostrar(true);

  const tableRef = useRef(null);

  const fetchProductos = useCallback(async () => {
    try {
      const respuesta = await fetch('http://localhost:3002/api/productos');
      const data = await respuesta.json();
      setProductos(data);
    } catch (error) {
      alert('Error: ' + error);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    if (productos.length > 0) {
      const tabla = $(tableRef.current).DataTable();
      return () => tabla.destroy();
    }
  }, [productos]);

  const cambiosFormularioAgregar = (e) => {
    SetAgregarProducto({
      ...formularioAgregar,
      [e.target.name]: e.target.value
    });
  };

  const cambioFormularioEditar = (e) => {
    SetEditarProducto({
      ...formularioEditar,
      [e.target.name]: e.target.value
    });
  };

  const Agregar = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:3002/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularioAgregar)
      });

      if (!respuesta.ok) throw new Error('Error al agregar');

      handleClose();
      fetchProductos();
      Swal.fire("¡Producto agregado!", "", "success");
    } catch (error) {
      Swal.fire("Error al agregar", error.message, "error");
    }
  };

  const EditarProductos = (producto) => {
    
    SetEditarProducto({
      nombre: '',
      descripcion: '',
      categoria: '',
      marca: '',
      precio: '',
      stock: '',
      talla: '',
      color: ''
    });

    
    SetEditarProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      marca: producto.marca,
      precio: producto.precio,
      stock: producto.stock,
      talla: producto.talla,
      color: producto.color
    });
    setProductoId(producto.id);
    AbrirModal();
  };

  const EditarProducto = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(`http://localhost:3002/api/productos/${productoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularioEditar)
      });

      if (!respuesta.ok) throw new Error('Error al editar');

      CerrarModal();
      fetchProductos();
      Swal.fire("¡Producto editado!", "", "success");
    } catch (error) {
      Swal.fire("Error al editar", error.message, "error");
    }
  };

  const EliminarProducto = async (id) => {
    Swal.fire({
      title: "¿Eliminar este producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          
          const respuesta = await fetch(`http://localhost:3002/api/productos/${id}`, {
            method: 'DELETE'
          });
  
          if (!respuesta.ok) {
            throw new Error('Error al eliminar el producto de la base de datos');
          }
  
          setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
  
          
          SetEditarProducto({
            nombre: '',
            descripcion: '',
            categoria: '',
            marca: '',
            precio: '',
            stock: '',
            talla: '',
            color: ''
          });
  
          Swal.fire("¡Producto eliminado!", "", "success");
          
          window.location.reload();

  
        } catch (error) {
          Swal.fire("Error al eliminar", error.message, "error");
        }
      }
    });
  };
  
  
  

  return (
    <div className="contenedor">
      <Button variant="primary" onClick={handleShow}>Crear</Button>
      <Table striped bordered hover ref={tableRef}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.categoria}</td>
              <td>{producto.marca}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.talla}</td>
              <td>{producto.color}</td>
              <td>
                <Button variant="primary" onClick={() => EditarProductos(producto)}><MdEdit /></Button>{' '}
                <Button variant="danger" onClick={() => EliminarProducto(producto.id)}><MdDelete /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Agregar */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>Agregar Producto</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formularioAgregar).map((campo) => (
              <Form.Group className="mb-3" key={campo}>
                <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
                <Form.Control
                  type={campo === 'precio' || campo === 'stock' ? 'number' : 'text'}
                  name={campo}
                  value={formularioAgregar[campo]}
                  onChange={cambiosFormularioAgregar}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={Agregar}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Editar */}
      <Modal show={mostrar} onHide={CerrarModal}>
        <Modal.Header closeButton><Modal.Title>Editar Producto</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formularioEditar).map((campo) => (
              <Form.Group className="mb-3" key={campo}>
                <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
                <Form.Control
                  type={campo === 'precio' || campo === 'stock' ? 'number' : 'text'}
                  name={campo}
                  value={formularioEditar[campo]}
                  onChange={cambioFormularioEditar}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={CerrarModal}>Cerrar</Button>
          <Button variant="primary" onClick={EditarProducto}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
