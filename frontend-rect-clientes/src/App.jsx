import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

// Componentes de Bootstrap
import { Button, Table, Modal, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as yup from 'yup';
import * as formik from 'formik';



const API_URL = "http://localhost:8080/api/cliente";

function App() {

  // Clientes
  const [clientes, setClientes] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState({})
  const [mensaje, setMensaje] = useState("")

  //Formik y esquema de validacion
  const { Formik } = formik;

  const schema = yup.object().shape({
    firstName: yup.string()
      .required("El nombre es requerido")
      .min(3, 'Debe tener al menos 3 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo debe contener letras'),

    surName: yup.string()
      .required("El apellido paterno es requerido")
      .min(3, 'Debe tener al menos 3 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo debe contener letras'),

    lastName: yup.string()
      .min(3, 'Debe tener al menos 3 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo debe contener letras'),

    curp: yup.string().required("La CURP es requerida"),

    birthday: yup.string().required("La fecha de nacimiento es requerida")
  });


  // Para modal de la vista de cliente
  const [vistaCliente, setVistaCliente] = useState(false);

  const cerrarVistaCliente = () => {
    setVistaCliente(false)
    setClienteSeleccionado({});
  };

  const abrirVistaCliente = (idCliente) => {
    cargarCliente(idCliente);
    setVistaCliente(true)
  };



  // Para el modal de eliminar cliente
  const [ventanaEliminarCliente, setVentanaEliminarCliente] = useState(false);

  const cerrarVentanaEliminar = () => {
    setVentanaEliminarCliente(false);
    setClienteSeleccionado({});
  };
  const abrirVentanaEliminar = (id, nombre) => {
    setClienteSeleccionado({ id: id, nombre: nombre });
    setVentanaEliminarCliente(true)
  };


  // Para el modal de modificar cliente
  const [vistaModificarCliente, setVistaModificarCliente] = useState(false);

  const cerrarVistaModificar = () => setVistaModificarCliente(false);
  const mostrarVistaModificar = (idCliente) => {
    axios.get(`${API_URL}/${idCliente}`)
      .then((response) => {
        setClienteSeleccionado(response.data.datos); // <-- actualiza con los datos del cliente
        setVistaModificarCliente(true);              // <-- luego muestra el modal
      })
      .catch((error) => {
        console.error("Error al cargar cliente para modificar:", error);
      });
  };



  // Para el modal de alertas y exitos
  const [ventanaConfirmacion, setVentanaConfirmacion] = useState(false);

  const cerrarConfirmacion = () => {
    setVentanaConfirmacion(false);
  };
  const abrirConfirmacion = (texto) => {
    setMensaje(texto);
    setVentanaConfirmacion(true);
  };


  // Para crear nuevo registro
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  const abrirModalCrear = () => setMostrarModalCrear(true);
  const cerrarModalCrear = () => setMostrarModalCrear(false);





  // Metodo que sirve para cargar la lista de clientes
  const cargarClientes = () => {
    axios.get(`${API_URL}/get-all`).then((response) => {
      console.log(response.data)
      setClientes(response.data);
    });
  }

  // Metodo que sirve para cargar la info de un solo cliente
  const cargarCliente = (idCliente) => {
    axios.get(`${API_URL}/${idCliente}`).then((response) => {
      setClienteSeleccionado(response.data.datos);
    });
  }

  // Metodo que sirve para eliminar un cliente
  const eliminarCliente = () => {
    setVentanaEliminarCliente(false);
    axios.put(`${API_URL}/delete/${clienteSeleccionado.id}`).then((response) => {
      console.log(response.data);
      cargarClientes();
      abrirConfirmacion("Cliente eliminado correctamente");
    });
  }


  // Aqui se cargan los primeros registros
  useEffect(() => {
    cargarClientes();
  }, [])

  return (
    <>
      <Button className="d-flex justify-content-between align-items-center mb-5"
      variant="success" onClick={abrirModalCrear}>Nuevo Cliente</Button>

      <h1>Gestion de clientes</h1>
      <Table border="1" striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>CURP</th>
            <th>Fecha de nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {
            // Aqui se carga la tabla con la lista de clientes
            clientes.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>{item.apellidoPaterno}{item.apellidoMaterno && ` ${item.apellidoMaterno}`}</td>
                <td>{item.curp}</td>
                <td>{`${item.fechaNacimiento}`.slice(0, 10)}</td>
                <th>
                  <Button id={item.id} variant="primary" onClick={() => abrirVistaCliente(item.id)} className="me-2">Ver</Button>
                  <Button variant="success" onClick={() => mostrarVistaModificar(item.id)} className="me-2">Modificar</Button>
                  <Button variant="danger" onClick={() => abrirVentanaEliminar(item.id, item.nombre)} className="me-2">Eliminar</Button>
                </th>
              </tr>
            ))
          }
        </tbody>

      </Table>


      { /* Seccion de los modales */}

      { /* Modal para ver los datos del usuario */}
      <Modal show={vistaCliente} onHide={cerrarVistaCliente}>
        <Modal.Header closeButton>
          <Modal.Title>Cliente {clienteSeleccionado?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li><strong>Id de cliente:</strong> {clienteSeleccionado?.id}</li>
            <li><strong>Nombre(s):</strong> {clienteSeleccionado?.nombre}</li>
            {clienteSeleccionado.apellidoMaterno ?
              <div>
                <li><strong>Apellido paterno: </strong> {clienteSeleccionado?.apellidoPaterno}</li>
                <li><strong>Apellido materno: </strong> {clienteSeleccionado?.apellidoMaterno}</li>
              </div> :

              <li><strong>Apellido: </strong> {clienteSeleccionado?.apellidoPaterno}</li>
            }
            <li><strong>CURP:</strong> {clienteSeleccionado?.curp}</li>
            <li><strong>Fecha de nacimiento:</strong> {`${clienteSeleccionado?.fechaNacimiento}`.slice(0, 10)}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarVistaCliente}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      { /* Modal para eliminar un cliente */}
      <Modal show={ventanaEliminarCliente} onHide={cerrarVentanaEliminar}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`¿Estas seguro que desea eliminar a ${clienteSeleccionado.nombre}?`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarVentanaEliminar}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={eliminarCliente}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      { /* Modal para modificar un cliente */}
      <Modal show={vistaModificarCliente} onHide={cerrarVistaModificar}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              firstName: clienteSeleccionado.nombre || '',
              surName: clienteSeleccionado.apellidoPaterno || '',
              lastName: clienteSeleccionado.apellidoMaterno || '',
              curp: clienteSeleccionado.curp || '',
              birthday: clienteSeleccionado.fechaNacimiento?.slice(0, 10) || '',
            }}
            validationSchema={schema}
            enableReinitialize
            onSubmit={(values, actions) => {
              const clienteModificado = {
                id: clienteSeleccionado.id,
                nombre: values.firstName,
                apellidoPaterno: values.surName,
                apellidoMaterno: values.lastName,
                curp: values.curp,
                fechaNacimiento: values.birthday,
              };

              axios.put(`${API_URL}/update`, clienteModificado)
                .then((response) => {
                  console.log('Cliente actualizado:', response.data);
                  cargarClientes();
                  cerrarVistaModificar();
                  abrirConfirmacion("Cliente modificado correctamente");
                })
                .catch((error) => {
                  console.error("Error al modificar cliente:", error);
                });

              actions.setSubmitting(false);
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="validationFormik101" className="mb-3">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    isValid={touched.firstName && !errors.firstName}
                    isInvalid={touched.firstName && !!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationFormik102" className="mb-3">
                  <Form.Label>Apellido paterno:</Form.Label>
                  <Form.Control
                    type="text"
                    name="surName"
                    value={values.surName}
                    onChange={handleChange}
                    isValid={touched.surName && !errors.surName}
                    isInvalid={touched.surName && !!errors.surName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.surName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationFormik103" className="mb-3">
                  <Form.Label>Apellido materno:</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    isValid={touched.lastName && !errors.lastName}
                    isInvalid={touched.lastName && !!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationFormik104" className="mb-3">
                  <Form.Label>CURP:</Form.Label>
                  <Form.Control
                    type="text"
                    name="curp"
                    value={values.curp}
                    onChange={handleChange}
                    isValid={touched.curp && !errors.curp}
                    isInvalid={touched.curp && !!errors.curp}
                  />
                  <Form.Control.Feedback type="invalid">{errors.curp}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="validationFormik105" className="mb-3">
                  <Form.Label>Fecha de nacimiento:</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={values.birthday}
                    onChange={handleChange}
                    isValid={touched.birthday && !errors.birthday}
                    isInvalid={touched.birthday && !!errors.birthday}
                  />
                  <Form.Control.Feedback type="invalid">{errors.birthday}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={cerrarVistaModificar} className="me-2">
                    Cerrar
                  </Button>
                  <Button variant="primary" type="submit">
                    Modificar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>


      { /* Modal para crear un nuevo cliente */}
      <Modal show={mostrarModalCrear} onHide={cerrarModalCrear}>
        <Modal.Header closeButton>
          <Modal.Title>Crear nuevo cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              firstName: '',
              surName: '',
              lastName: '',
              curp: '',
              birthday: '',
            }}
            validationSchema={schema}
            onSubmit={(values, actions) => {
              const nuevoCliente = {
                nombre: values.firstName,
                apellidoPaterno: values.surName,
                apellidoMaterno: values.lastName,
                curp: values.curp,
                fechaNacimiento: values.birthday,
              };

              axios.post(`${API_URL}/save`, nuevoCliente)
                .then((response) => {
                  console.log('Cliente creado:', response.data);
                  cargarClientes();
                  cerrarModalCrear();
                  abrirConfirmacion("Cliente creado correctamente");
                })
                .catch((error) => {
                  console.error("Error al crear cliente:", error);
                });

              actions.setSubmitting(false);
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    isValid={touched.firstName && !errors.firstName}
                    isInvalid={touched.firstName && !!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Apellido paterno</Form.Label>
                  <Form.Control
                    type="text"
                    name="surName"
                    value={values.surName}
                    onChange={handleChange}
                    isValid={touched.surName && !errors.surName}
                    isInvalid={touched.surName && !!errors.surName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.surName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Apellido materno</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    isValid={touched.lastName && !errors.lastName}
                    isInvalid={touched.lastName && !!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>CURP</Form.Label>
                  <Form.Control
                    type="text"
                    name="curp"
                    value={values.curp}
                    onChange={handleChange}
                    isValid={touched.curp && !errors.curp}
                    isInvalid={touched.curp && !!errors.curp}
                  />
                  <Form.Control.Feedback type="invalid">{errors.curp}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={values.birthday}
                    onChange={handleChange}
                    isValid={touched.birthday && !errors.birthday}
                    isInvalid={touched.birthday && !!errors.birthday}
                  />
                  <Form.Control.Feedback type="invalid">{errors.birthday}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={cerrarModalCrear} className="me-2">
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Crear
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>


      { /* Modal para eliminar un cliente */}
      <Modal show={ventanaConfirmacion} onHide={cerrarConfirmacion}>
        <Modal.Header closeButton>
          <Modal.Title>Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mensaje}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={cerrarConfirmacion}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

    </>


  )
}

export default App
