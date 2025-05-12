<template>
  <div class="d-flex align-items-center justify-content-center pantalla">
    <div>
      <button type="button" class="btn btn-success">Añadir</button>
      <h1>Gestion de clientes</h1>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellidos</th>
            <th scope="col">CURP</th>
            <th scope="col">Fecha de nacimiento</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr v-for="item in items" key="item.id">
            <td>{{ item.id }}</td>
                <td>{{ item.nombre }}</td>
                <td>{{ item.apellidoPaterno }}{{ item.apellidoMaterno && ` ${item.apellidoMaterno}` }}</td>
                <td>{{ item.curp }}</td>
                <td>{{`${item.fechaNacimiento}`.slice(0, 10)}}</td>
                <th>
                  <Button id={item.id} variant="primary" onClick={() => abrirVistaCliente(item.id)} className="me-2">Ver</Button>
                  <Button variant="success" onClick={() => mostrarVistaModificar(item.id)} className="me-2">Modificar</Button>
                  <Button variant="danger" onClick={() => abrirVentanaEliminar(item.id, item.nombre)} className="me-2">Eliminar</Button>
                </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
const clientes = ref([]);

// Metodo que sirve para cargar la lista de clientes
const cargarClientes = () => {
  axios.get(`${API_URL}/get-all`).then((response) => {
    console.log(response.data);
    setClientes(response.data);
  });
};

// Metodo que sirve para cargar la info de un solo cliente
const cargarCliente = (idCliente) => {
  axios.get(`${API_URL}/${idCliente}`).then((response) => {
    setClienteSeleccionado(response.data.datos);
  });
};

// Metodo que sirve para eliminar un cliente
const eliminarCliente = () => {
  setVentanaEliminarCliente(false);
  axios.put(`${API_URL}/delete/${clienteSeleccionado.id}`).then((response) => {
    console.log(response.data);
    cargarClientes();
    abrirConfirmacion("Cliente eliminado correctamente");
  });
};
</script>



</style>

<style scoped>
.pantalla {
  height: 100vh; /* Esto asegura que el contenedor tenga toda la altura de la pantalla */
  width: 100%;
}
</style>

