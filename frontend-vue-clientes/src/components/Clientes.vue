<template>
  <div class="d-flex align-items-center justify-content-center pantalla">
    <div>
      <button type="button" class="btn btn-success mb-3" data-bs-toggle="modal"
        data-bs-target="#registrarClienteModal">Añadir nuevo cliente</button>

      <div class="d-flex flex-column align-items-center mb-4">
        <h1 class="text-center">Gestión de clientes</h1>
      </div>

      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre(s)</th>
            <th scope="col">Apellidos(s)</th>
            <th scope="col">CURP</th>
            <th scope="col">Fecha de nacimiento</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ formatearApellido(item) }}</td>
            <td>{{ item.curp }}</td>
            <td>{{ item.fechaNacimiento ? item.fechaNacimiento.slice(0, 10) : '' }}</td>
            <td>
              <button :id="item.id" class="btn btn-primary me-2" @click="cargarCliente(item.id)" data-bs-toggle="modal"
                data-bs-target="#informacionCliente">
                Ver
              </button>
              <button class="btn btn-success me-2" @click="cargarCliente(item.id)" data-bs-toggle="modal"
                data-bs-target="#actualizarClienteModal">
                Modificar
              </button>
              <button class="btn btn-danger me-2" @click="cargarCliente(item.id)" data-bs-toggle="modal"
                data-bs-target="#eliminarClienteModal">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal para ver la informacion del cliente -->
  <div class="modal fade" id="informacionCliente" tabindex="-1" aria-labelledby="informacionClienteLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="informacionClienteLabel">Cliente {{ clienteSeleccionado?.id }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

          <ul>
            <li><strong>Id de cliente:</strong> {{ clienteSeleccionado?.id }}</li>
            <li><strong>Nombre(s):</strong> {{ clienteSeleccionado?.nombre }}</li>

            <div v-if="clienteSeleccionado?.apellidoMaterno">
              <li><strong>Apellido paterno: </strong> {{ clienteSeleccionado?.apellidoPaterno }}</li>
              <li><strong>Apellido materno: </strong> {{ clienteSeleccionado?.apellidoMaterno }}</li>
            </div>
            <li v-else><strong>Apellido: </strong> {{ clienteSeleccionado?.apellidoPaterno }}</li>

            <li><strong>CURP:</strong> {{ clienteSeleccionado?.curp }}</li>
            <li><strong>Fecha de nacimiento:</strong> {{ `${clienteSeleccionado?.fechaNacimiento}`.slice(0, 10) }}</li>
          </ul>

        </div>
      </div>
    </div>
  </div>

  <!-- Modal para registrar un nuevo cliente -->
  <div class="modal fade" id="registrarClienteModal" tabindex="-1" aria-labelledby="registrarClienteModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="registrarClienteModalLabel">Registrar cliente</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="registrarCliente">
            <div class="mb-3">
              <label class="col-form-label">Nombre:</label>
              <input type="text" class="form-control" v-model="nuevoCliente.nombre">
              <div v-if="erroresRegistro.nombre" class="text-danger">{{ erroresRegistro.nombre }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">Apellido paterno:</label>
              <input type="text" class="form-control" v-model="nuevoCliente.apellidoPaterno">
              <div v-if="erroresRegistro.nombre" class="text-danger">{{ erroresRegistro.apellidoPaterno }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">Apellido materno:</label>
              <input type="text" class="form-control" v-model="nuevoCliente.apellidoMaterno">
              <div v-if="erroresRegistro.nombre" class="text-danger">{{ erroresRegistro.apellidoMaterno }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">CURP:</label>
              <input type="text" class="form-control" v-model="nuevoCliente.curp">
              <div v-if="erroresRegistro.nombre" class="text-danger">{{ erroresRegistro.curp }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">Fecha de nacimiento:</label>
              <input type="date" class="form-control" v-model="nuevoCliente.fechaNacimiento">
              <div v-if="erroresRegistro.nombre" class="text-danger">{{ erroresRegistro.fechaNacimiento }}</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="registrarCliente">Registrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para actualizar un nuevo cliente -->
  <div class="modal fade" id="actualizarClienteModal" tabindex="-1" aria-labelledby="actualizarClienteModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="actualizarClienteModalLabel">Actualizar cliente</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="registrarCliente">
            <div class="mb-3">
              <label class="col-form-label">Nombre:</label>
              <input type="text" class="form-control" v-model="clienteSeleccionado.nombre">
              <div v-if="erroresActualizacion.nombre" class="text-danger">{{ erroresActualizacion.nombre }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">Apellido paterno:</label>
              <input type="text" class="form-control" v-model="clienteSeleccionado.apellidoPaterno">
              <div v-if="erroresActualizacion.nombre" class="text-danger">{{ erroresActualizacion.apellidoPaterno }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">Apellido materno:</label>
              <input type="text" class="form-control" v-model="clienteSeleccionado.apellidoMaterno">
              <div v-if="erroresActualizacion.nombre" class="text-danger">{{ erroresActualizacion.apellidoMaterno }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">CURP:</label>
              <input type="text" class="form-control" v-model="clienteSeleccionado.curp">
              <div v-if="erroresActualizacion.nombre" class="text-danger">{{ erroresActualizacion.curp }}</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label">Fecha de nacimiento:</label>
              <input type="date" class="form-control" v-model="clienteSeleccionado.fechaNacimiento">
              <div v-if="erroresActualizacion.nombre" class="text-danger">{{ erroresActualizacion.fechaNacimiento }}</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="actualizarCliente">Actualizar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para eliminar clientes -->
  <div class="modal fade" id="eliminarClienteModal" tabindex="-1" aria-labelledby="eliminarClienteModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="eliminarClienteModalLabel">Eliminar cliente</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Estas seguro que deseas eliminar a {{ clienteSeleccionado?.nombre }}?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-danger" @click="eliminarCliente">Eliminar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para mostrar mensajes de exito -->
  <div class="modal fade" id="mensajeModal" tabindex="-1" aria-labelledby="mensajeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="mensajeModalLabel">Éxito</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          {{ mensajeModal }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import * as yup from "yup";


const API_URL = "http://localhost:8080/api/cliente";

export default {
  setup() {
    //Estado de errores
    const erroresRegistro = ref({});
    const erroresActualizacion = ref({});


    // Esquema de validacion de los campos del usuario
    const clienteSchema = yup.object().shape({
      nombre: yup.string().required("El nombre es obligatorio"),
      apellidoPaterno: yup.string().required("El apellido paterno es obligatorio"),
      apellidoMaterno: yup.string(), // Es opcional
      curp: yup.string()
        .required("La CURP es obligatoria")
        .matches(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, "CURP inválida"),
      fechaNacimiento: yup.date()
        .required("La fecha de nacimiento es obligatoria")
        .typeError("Fecha inválida"),
    });


    const items = ref([]);
    const clienteSeleccionado = ref({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      curp: "",
      fechaNacimiento: "",
    });
    const mensajeModal = ref(null);
    const nuevoCliente = ref({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      curp: "",
      fechaNacimiento: "",
    });

    const cargarClientes = () => {
      axios.get(`${API_URL}/get-all`).then((response) => {
        items.value = response.data;
      });
    };

    const cargarCliente = (idCliente) => {
      axios.get(`${API_URL}/${idCliente}`).then((response) => {
        const cliente = response.data.datos;

        // Aseguramos que la fecha esté en formato YYYY-MM-DD
        cliente.fechaNacimiento = cliente.fechaNacimiento
          ? cliente.fechaNacimiento.slice(0, 10)
          : '';
        clienteSeleccionado.value = cliente;
      });
    };

    const registrarCliente = async () => {
      try {
        await clienteSchema.validate(nuevoCliente.value, { abortEarly: false });
        erroresRegistro.value = {}; // limpiar errores

        await axios.post(`${API_URL}/save`, nuevoCliente.value);

        cargarClientes();

        const modal = bootstrap.Modal.getInstance(document.getElementById("registrarClienteModal"));
        modal.hide();

        nuevoCliente.value = {
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          curp: "",
          fechaNacimiento: "",
        };

        mensajeModal.value = "Se ha registrado correctamente al cliente";
        const modalElement = document.getElementById("mensajeModal");
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
      } catch (err) {
        if (err.inner) {
          erroresRegistro.value = {};
          err.inner.forEach(e => {
            erroresRegistro.value[e.path] = e.message;
          });
        } else {
          console.error("Error al registrar cliente:", err);
        }
      }
    };


    const eliminarCliente = () => {
      axios.put(`${API_URL}/delete/${clienteSeleccionado.value.id}`)
        .then(() => {
          let clienteEliminado = clienteSeleccionado.value.nombre;

          // Se carga de nuevo la lista de clientes
          cargarClientes();

          // Cierra el modal con Bootstrap
          const modal = bootstrap.Modal.getInstance(document.getElementById("eliminarClienteModal"));
          modal.hide();

          // Limpiar el formulario
          clienteSeleccionado.value = {
            id: "",
            nombre: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            curp: "",
            fechaNacimiento: "",
          };

          // Muestra un mensaje de exito en forma de otro modal
          mensajeModal.value = "Se ha eliminado al cliente " + clienteEliminado;
          const modalElement = document.getElementById("mensajeModal");
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();

        })
        .catch((error) => {
          console.error("Error al registrar cliente:", error);
        });
    };

    const actualizarCliente = async () => {
      try {
        await clienteSchema.validate(clienteSeleccionado.value, { abortEarly: false });
        erroresActualizacion.value = {}; // limpiar errores

        await axios.put(`${API_URL}/update`, clienteSeleccionado.value);

        cargarClientes();

        const modal = bootstrap.Modal.getInstance(document.getElementById("actualizarClienteModal"));
        modal.hide();

        clienteSeleccionado.value = {
          id: "",
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          curp: "",
          fechaNacimiento: "",
        };

        mensajeModal.value = "Se ha actualizado correctamente al cliente";
        const modalElement = document.getElementById("mensajeModal");
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
      } catch (err) {
        if (err.inner) {
          erroresActualizacion.value = {};
          err.inner.forEach(e => {
            erroresActualizacion.value[e.path] = e.message;
          });
        } else {
          console.error("Error al actualizar cliente:", err);
        }
      }
    };



    const formatearApellido = (item) => {
      return (
        item.apellidoPaterno +
        (item.apellidoMaterno ? ` ${item.apellidoMaterno}` : "")
      );
    };

    onMounted(cargarClientes);

    return {
      erroresRegistro,
      erroresActualizacion,
      mensajeModal,
      items,
      clienteSeleccionado,
      nuevoCliente,
      cargarCliente,
      registrarCliente,
      actualizarCliente,
      eliminarCliente,
      formatearApellido,
    };
  },
};

</script>

<style scoped>
.pantalla {
  height: 100vh;
  width: 100%;
}
</style>
