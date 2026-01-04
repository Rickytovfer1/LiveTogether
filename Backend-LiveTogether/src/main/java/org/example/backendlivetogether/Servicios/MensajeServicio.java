package org.example.backendlivetogether.Servicios;

import org.example.backendlivetogether.DTOs.MensajeDTO;
import org.example.backendlivetogether.Modelos.Mensaje;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Repositorios.IMensajeRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MensajeServicio {
    private final IMensajeRepositorio iMensajeRepositorio;
    private final IVecinoRepositorio iVecinoRepositorio;
    private final WebSocketMensajeService webSocketMensajeService;

    public MensajeServicio(IMensajeRepositorio iMensajeRepositorio, IVecinoRepositorio iVecinoRepositorio, @Lazy WebSocketMensajeService webSocketMensajeService) {
        this.iMensajeRepositorio = iMensajeRepositorio;
        this.iVecinoRepositorio = iVecinoRepositorio;
        this.webSocketMensajeService = webSocketMensajeService;
    }

    public void enviarMensaje(MensajeDTO mensajeDTO) {
        Mensaje mensaje = new Mensaje();
        mensaje.setTexto(mensajeDTO.getTexto());
        mensaje.setHora(LocalTime.now());
        mensaje.setFecha(LocalDate.now());
        Vecino emisor = iVecinoRepositorio.findByUsuario_Id(mensajeDTO.getIdEmisor());
        Vecino receptor = iVecinoRepositorio.findByUsuario_Id(mensajeDTO.getIdReceptor());
        mensaje.setEmisor(emisor);
        mensaje.setReceptor(receptor);
        iMensajeRepositorio.save(mensaje);
        MensajeDTO mensajeEnviado = getMensajeDTO(mensaje);
        webSocketMensajeService.enviarMensaje(mensajeEnviado);

    }

    public List<MensajeDTO> mostrarConversacion(Integer idUsuarioEmisor, Integer idUsuarioReceptor) {
        Vecino vecinoEmisor = iVecinoRepositorio.findByUsuario_Id(idUsuarioEmisor);
        Vecino vecinoReceptor = iVecinoRepositorio.findByUsuario_Id(idUsuarioReceptor);
        Integer idEmisorVecino = vecinoEmisor.getId();
        Integer idReceptorVecino = vecinoReceptor.getId();
        List<Mensaje> conversacion = iMensajeRepositorio.findByEmisor_IdAndReceptor_IdOrEmisor_IdAndReceptor_IdOrderByFechaAscHoraAsc(idEmisorVecino, idReceptorVecino, idReceptorVecino, idEmisorVecino);
        List<MensajeDTO> mensajesDTO = new ArrayList<>();
        for (Mensaje m : conversacion) {
            mensajesDTO.add(getMensajeDTO(m));
        }
        return mensajesDTO;
    }

    private MensajeDTO getMensajeDTO(Mensaje e) {
        MensajeDTO dtonuevo = new MensajeDTO();
        dtonuevo.setId(e.getId());
        dtonuevo.setTexto(e.getTexto());
        dtonuevo.setHora(e.getHora());
        dtonuevo.setFecha(e.getFecha());
        dtonuevo.setEditado(e.isEditado());
        dtonuevo.setBorrado(e.isBorrado());
        if (e.getEmisor() != null && e.getEmisor().getUsuario() != null) {
            dtonuevo.setIdEmisor(e.getEmisor().getUsuario().getId());
        } else {
            dtonuevo.setIdEmisor(null);
        }
        if (e.getReceptor() != null && e.getReceptor().getUsuario() != null) {
            dtonuevo.setIdReceptor(e.getReceptor().getUsuario().getId());
        } else {
            dtonuevo.setIdReceptor(null);
        }
        return dtonuevo;
    }

    public MensajeDTO editarMensaje(Integer id, String nuevoTexto) {
        Mensaje mensaje = iMensajeRepositorio.findById(id).orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setTexto(nuevoTexto);
        mensaje.setEditado(true);
        iMensajeRepositorio.save(mensaje);
        MensajeDTO mensajeEditado = getMensajeDTO(mensaje);
        webSocketMensajeService.enviarMensajeEditado(mensajeEditado);
        return mensajeEditado;
    }

    public MensajeDTO eliminarMensaje(Integer id) {
        Mensaje mensaje = iMensajeRepositorio.findById(id).orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setTexto("Este mensaje ha sido borrado");
        mensaje.setBorrado(true);
        iMensajeRepositorio.save(mensaje);
        MensajeDTO mensajeEliminado = getMensajeDTO(mensaje);
        webSocketMensajeService.enviarMensajeEliminado(mensajeEliminado);
        return mensajeEliminado;
    }
}
