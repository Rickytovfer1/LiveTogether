package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.*;
import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Seguridad.UsuarioAdapter;
import org.example.backendlivetogether.Servicios.UsuarioServicio;
import org.example.backendlivetogether.Servicios.VecinoServicio;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vecino")
@AllArgsConstructor
public class VecinoControlador {

    private VecinoServicio vecinoServicio;

    private UsuarioServicio usuarioServicio;

    @GetMapping("/listar/vecinos")
    public List<VecinoDTO> listarVecinos(){
        return vecinoServicio.listarVecinos();
    }

    @GetMapping("/ver/vecino/{idVecino}")
    public VecinoDTO verVecinoID(@PathVariable Integer idVecino){
        return vecinoServicio.verVecinoID(idVecino);
    }

    @GetMapping("/ver/vecino/usuario/{idUsuario}")
    public VecinoDTO verVecinoUsuarioID(@PathVariable Integer idUsuario){
        return vecinoServicio.verVecinoUsuarioID(idUsuario);
    }

    @GetMapping("/usuario/correo/{correo}")
    public Usuario buscarUsuarioPorCorreo(@PathVariable String correo){
        UserDetails userDetails = usuarioServicio.loadUserByUsername(correo);
        if (userDetails instanceof UsuarioAdapter) {
            return ((UsuarioAdapter) userDetails).getUsuario();
        }
        throw new RuntimeException("El usuario autenticado no es del tipo esperado.");
    }

    @GetMapping("/listar/vecinos/comunidad/{idComunidad}")
    public List<VecinoUsuarioDTO> listarVecinoComunidad(@PathVariable Integer idComunidad){
        return vecinoServicio.listarVecinosIdComunidad(idComunidad);
    }

    @PostMapping("/insertar/codigo")
    public void insertarCodigoComunidad(@RequestBody InsertarCodigoDTO dto){
        vecinoServicio.insertarCodigoComunidad(dto);
    }

    @GetMapping("/buscar/comunidad/codigo/{codigo}")
    public ComunidadDTO buscarComunidadPorCodigo(@PathVariable String codigo){
        return vecinoServicio.buscarComunidadPorCodigo(codigo);
    }

    @GetMapping("/listar/propietarios/{idComunidad}")
    public List<VecinoUsuarioDTO> listarPropietarios(@PathVariable Integer idComunidad) {
        return vecinoServicio.listarPropietarios(idComunidad);
    }

    @PostMapping("/solicitar/{idVivienda}/{idComunidad}/{idVecino}")
    public void solicitarIngresoComunidad(@PathVariable Integer idVivienda, @PathVariable Integer idComunidad,
                                          @PathVariable Integer idVecino){
        vecinoServicio.solicitarIngresoComunidad(idVivienda, idComunidad, idVecino);
    }

    @GetMapping("/ver/notificaciones/{idVecino}/{idComunidad}")
    public List<NotificacionDTO> verNotificaciones(@PathVariable Integer idVecino, @PathVariable Integer idComunidad){
        return vecinoServicio.verNotificaciones(idVecino, idComunidad);
    }

    @PostMapping("eliminar/notificacion/{idNotificacion}/{idVecino}")
    public void eliminarNotificacion(@PathVariable Integer idNotificacion, @PathVariable Integer idVecino){
        vecinoServicio.eliminarNotificacion(idNotificacion, idVecino);
    }

}
