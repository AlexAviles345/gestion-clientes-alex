package utez.edu.mx.GestionClientes.clientes;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Transactional(rollbackFor = {SQLException.class, Exception.java})
    public List<ClienteEntity> getAllClientes(){
        return clienteRepository.findAll();
    }
}
