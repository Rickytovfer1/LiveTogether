package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.ComunidadDTO;
import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Seguridad.UsuarioAdapter;
import org.example.backendlivetogether.Servicios.ComunidadServicio;
import org.example.backendlivetogether.Servicios.UsuarioServicio;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class ComunidadControlador {

    private ComunidadServicio comunidadServicio;

    private UsuarioServicio usuarioServicio;

    @GetMapping("/vecino/ver/comunidad/{idComunidad}")
    public ComunidadDTO verComunidadID(@PathVariable Integer idComunidad){
        return comunidadServicio.verComunnidadID(idComunidad);
    }

    @GetMapping("/vecino/ver/comunidad/usuario/{idUsuario}")
    public ComunidadDTO verComunidadUsuarioID(@PathVariable Integer idUsuario){
        return comunidadServicio.verComunidadUsuarioID(idUsuario);
    }

    @GetMapping("/vecino/listar/comunidades")
    public List<ComunidadDTO> listarTodasComunidades(){
        return comunidadServicio.listarTodasComunidades();
    }

    @GetMapping("/vecino/listar/comunidades/{idVecino}")
    public List<ComunidadDTO> listarComunidades(@PathVariable Integer idVecino){
        return comunidadServicio.listarComunidades(idVecino);
    }

    @GetMapping("/comunidad/usuario/correo/{correo}")
    public Usuario buscarUsuarioPorCorreo(@PathVariable String correo){
        UserDetails userDetails = usuarioServicio.loadUserByUsername(correo);
        if (userDetails instanceof UsuarioAdapter) {
            return ((UsuarioAdapter) userDetails).getUsuario();
        }
        throw new RuntimeException("El usuario autenticado no es del tipo esperado.");
    }

}
