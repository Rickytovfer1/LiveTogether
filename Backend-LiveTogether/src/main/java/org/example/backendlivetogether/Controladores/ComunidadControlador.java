package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.ComunidadDTO;
import org.example.backendlivetogether.DTOs.VecinoDTO;
import org.example.backendlivetogether.DTOs.VecinoUsuarioDTO;
import org.example.backendlivetogether.Enumerados.TipoNotificacion;
import org.example.backendlivetogether.Modelos.Solicitud;
import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Seguridad.UsuarioAdapter;
import org.example.backendlivetogether.Servicios.ComunidadServicio;
import org.example.backendlivetogether.Servicios.UsuarioServicio;
import org.example.backendlivetogether.Servicios.VecinoServicio;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class ComunidadControlador {

    private ComunidadServicio comunidadServicio;

    private UsuarioServicio usuarioServicio;

    private VecinoServicio vecinoServicio;

    @GetMapping("/vecino/ver/comunidad/{idComunidad}")
    public ComunidadDTO verComunidadID(@PathVariable Integer idComunidad){
        return comunidadServicio.verComunnidadID(idComunidad);
    }

    @GetMapping("/vecino/ver/comunidad/usuario/{idUsuario}")
    public ComunidadDTO verComunidadUsuarioID(@PathVariable Integer idUsuario){
        return comunidadServicio.verComunidadUsuarioID(idUsuario);
    }

    @GetMapping("/vecino/listar/todas/comunidades")
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

    @PostMapping("/comunidad/generar/codigo/{idVivienda}/{idComunidad}")
    public String generarCodigo(@PathVariable Integer idVivienda, @PathVariable Integer idComunidad){
        return comunidadServicio.generarCodigo(idVivienda, idComunidad);
    }

    @GetMapping("/comunidad/ver/comunidad/usuario/{idUsuario}")
    public ComunidadDTO verComunidadUsuarioIDComunidad(@PathVariable Integer idUsuario){
        return comunidadServicio.verComunidadUsuarioID(idUsuario);
    }

    @GetMapping("/comunidad/ver/vecino/{idVecino}")
    public VecinoDTO verVecinoID(@PathVariable Integer idVecino){
        return vecinoServicio.verVecinoID(idVecino);
    }

    @GetMapping("comunidad/listar/propietarios/{idComunidad}")
    public List<VecinoUsuarioDTO> listarPropietarios(@PathVariable Integer idComunidad) {
        return vecinoServicio.listarPropietarios(idComunidad);
    }

    @GetMapping("/comunidad/listar/solicitudes/{idComunidad}")
    public List<Solicitud> listarSolicitudesComunidad(@PathVariable Integer idComunidad){
        return comunidadServicio.listarSolicitudes(idComunidad);
    }

    @PostMapping("/comunidad/aceptar/solicitud")
    public void aceptarSolicitud(@RequestBody Solicitud solicitud){
        comunidadServicio.aceptarSolicitudEntrada(solicitud);
    }

    @PostMapping("/comunidad/rechazar/solicitud")
    public void rechazarSolicitud(@RequestBody Solicitud solicitud){
        comunidadServicio.rechazarSolicitud(solicitud);
    }

    @PostMapping("/comunidad/enviar/notificacion/{idsVecinos}/{idComunidad}/{tipoNotificacion}")
    public void enviarNotificacion(@PathVariable Integer[] idsVecinos, @PathVariable Integer idComunidad, @PathVariable TipoNotificacion tipoNotificacion) {
        comunidadServicio.enviarNotificacion(idsVecinos, idComunidad, tipoNotificacion);
    }

    @PostMapping("/vecino/enviar/notificacion/{idsVecinos}/{idComunidad}/{tipoNotificacion}")
    public void enviarNotificacionVecino(@PathVariable Integer[] idsVecinos, @PathVariable Integer idComunidad, @PathVariable TipoNotificacion tipoNotificacion) {
        comunidadServicio.enviarNotificacion(idsVecinos, idComunidad, tipoNotificacion);
    }


}
