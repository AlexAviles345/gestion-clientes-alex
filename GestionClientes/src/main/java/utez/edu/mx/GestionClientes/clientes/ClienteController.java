package utez.edu.mx.GestionClientes.clientes;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping("/get-all")
    public List<ClienteEntity> getAllClientes(){
        return clienteService.getAllClientes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getByIdCliente(@PathVariable Long id){
        return clienteService.getClienteById(id);
    }

    @PostMapping("/save")
    public ResponseEntity<?> getByIdCliente(@RequestBody ClienteEntity cliente){
        return clienteService.addCliente(cliente);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateByIdCliente(@RequestBody ClienteEntity cliente){
        return clienteService.actualizarCliente(cliente);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteByIdCliente(@PathVariable Long id){
        return clienteService.eliminarClienteById(id);
    }

}
