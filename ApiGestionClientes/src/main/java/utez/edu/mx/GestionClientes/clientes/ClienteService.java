package utez.edu.mx.GestionClientes.clientes;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    private Map<String, Object> body;
    private HttpStatus status;

    @Transactional( readOnly = true )
    public List<ClienteEntity> getAllClientes(){
        return clienteRepository.findAll();
    }

    @Transactional( readOnly = true )
    public ResponseEntity<?> getClienteById(Long id){
        Optional<ClienteEntity> cliente = clienteRepository.findById(id);
        body = new HashMap<>();

        if(cliente.isPresent()){
            body.put("datos", cliente.get());
            status = HttpStatus.OK;
        }
        else {
            body.put("mensaje", "Cliente no encontrado");
            status = HttpStatus.NOT_FOUND;
        }

        return new ResponseEntity<>(body, status);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> addCliente(ClienteEntity cliente){
        body = new HashMap<>();

        try {

            clienteRepository.save(cliente);

            body.put("datos", cliente);
            body.put("mensaje", "El cliente se ha guardado correctamente");
            status = HttpStatus.OK;

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(body, status);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> actualizarCliente(ClienteEntity clienteUpdate){
        Optional<ClienteEntity> cliente = clienteRepository.findById(clienteUpdate.getId());
        body = new HashMap<>();

        if(cliente.isPresent()){
            try {

                clienteRepository.save(clienteUpdate);

                body.put("datos", clienteUpdate);
                body.put("mensaje", "El cliente se ha actualizado correctamente");
                status = HttpStatus.OK;

            } catch (Exception e) {
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            }
        }
        else {
            body.put("mensaje", "Cliente no encontrado");
            status = HttpStatus.NOT_FOUND;
        }

        return new ResponseEntity<>(body, status);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> eliminarClienteById(Long id){
        Optional<ClienteEntity> cliente = clienteRepository.findById(id);
        body = new HashMap<>();

        if(cliente.isPresent()){

            try {
                clienteRepository.deleteById(id);

                body.put("mensaje", "El cliente se ha eliminado correctamente");
                status = HttpStatus.OK;
                System.out.println("HOLAAAA BORRANDO");

            } catch (Exception e) {
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            }
        }
        else {
            body.put("mensaje", "Cliente no encontrado");
            status = HttpStatus.NOT_FOUND;
        }

        return new ResponseEntity<>(body, status);
    }

}
