package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.LoginDTO;
import org.example.backendlivetogether.DTOs.RegistrarComunidadDTO;
import org.example.backendlivetogether.DTOs.RegistrarVecinoDTO;
import org.example.backendlivetogether.DTOs.RespuestaDTO;
import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Servicios.UsuarioServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/autorizacion")
@AllArgsConstructor
public class AutorizacionControlador {

    private UsuarioServicio usuarioServicio;

    @PostMapping("/login")
    public ResponseEntity<RespuestaDTO> login(@RequestBody LoginDTO dto){
        return usuarioServicio.login(dto);
    }

    @PostMapping("/registro/vecino")
    public Usuario registroVecino(@RequestBody RegistrarVecinoDTO registroDTO){
        return usuarioServicio.registrarVecino(registroDTO);
    }

    @PostMapping("/registro/comunidad")
    public Usuario registroComunidad(@RequestBody RegistrarComunidadDTO registroDTO){
        return usuarioServicio.registrarComunidad(registroDTO);
    }
}
