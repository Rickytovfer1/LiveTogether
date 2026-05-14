package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.ComunidadDTO;
import org.example.backendlivetogether.Enumerados.TipoNotificacion;
import org.example.backendlivetogether.Modelos.*;
import org.example.backendlivetogether.Repositorios.*;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class ComunidadServicio {

    private IComunidadRepositorio iComunidadRepositorio;

    private IVecinoRepositorio iVecinoRepositorio;

    private IViviendaRepositorio iViviendaRepositorio;

    private ISolicitudRepositorio iSolicitudRepositorio;

    private INotificacionRepositorio iNotificacionRepositorio;

    public ComunidadDTO verComunnidadID(Integer idComunidad){
        Comunidad comunidad = iComunidadRepositorio.findById(idComunidad)
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con este ID."));
        return getComunidadDTO(comunidad);
    }

    public ComunidadDTO verComunidadUsuarioID(Integer idUsuario) {
        Comunidad comunidad = iComunidadRepositorio.findByUsuario_Id(idUsuario);

        return getComunidadDTO(comunidad);
    }


    public List<ComunidadDTO> listarTodasComunidades(){
        List<Comunidad> comunidads = iComunidadRepositorio.findAll();
        List<ComunidadDTO> comunidadDTOS = new ArrayList<>();

        for (Comunidad comunidad: comunidads){
            comunidadDTOS.add(getComunidadDTO(comunidad));
        }

        return comunidadDTOS;
    }

    public List<ComunidadDTO> listarComunidades(Integer idVecino) {
        Vecino vecino = iVecinoRepositorio.findById(idVecino)
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID"));

        List<Comunidad> listaComunidades = iComunidadRepositorio.findAll();
        List<ComunidadDTO> comunidades = new ArrayList<>();

        Set<Vivienda> viviendasVecino = vecino.getViviendas();

        for (Comunidad comunidad : listaComunidades) {
            boolean tieneViviendaEnComunidad = comunidad.getViviendas().stream()
                    .anyMatch(viviendasVecino::contains);

            boolean esPresidente = comunidad.getPresidente() != null &&
                    comunidad.getPresidente().getId().equals(idVecino);

            if (tieneViviendaEnComunidad || esPresidente) {
                comunidades.add(getComunidadDTO(comunidad));
            }
        }

        return comunidades;
    }

    public String generarCodigo(Integer idVivienda, Integer idComunidad) {
        Random random = new Random();
        StringBuilder resultado = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            int number = random.nextInt(10);
            resultado.append(number);
        }

        Comunidad comunidad = iComunidadRepositorio.findById(idComunidad)
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con este ID."));

        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));

        String direccionEncoded = Base64.getEncoder().encodeToString(vivienda.getDireccionPersonal().getBytes(StandardCharsets.UTF_8));
        String codigoFinal = resultado + direccionEncoded;

        comunidad.setCodigoComunidad(codigoFinal);
        iComunidadRepositorio.save(comunidad);

        return codigoFinal;
    }

    public List<Solicitud> listarSolicitudes(Integer idComunidad) {
        List<Solicitud> solicitudes = iSolicitudRepositorio.findAll();
        List<Solicitud> solicitudesComunidad = new ArrayList<>();
        for (Solicitud solicitud : solicitudes) {
            if (solicitud.getIdComunidad().equals(idComunidad)) {
                solicitudesComunidad.add(solicitud);
            }
        }
        return solicitudesComunidad;
    }

    public void aceptarSolicitudEntrada(Solicitud solicitud) {
        Vivienda vivienda = iViviendaRepositorio.findById(solicitud.getIdVivienda())
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));
        Comunidad comunidad = iComunidadRepositorio.findById(solicitud.getIdComunidad())
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con este ID."));
        Vecino vecino = iVecinoRepositorio.findById(solicitud.getIdVecino())
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

        if (comunidad.getViviendas().contains(vivienda)) {
            vivienda.getVecinos().add(vecino);
            iViviendaRepositorio.save(vivienda);
            vecino.getViviendas().add(vivienda);
            iVecinoRepositorio.save(vecino);
            iSolicitudRepositorio.delete(solicitud);
        } else if (!comunidad.getViviendas().contains(vivienda)) {
            throw new RuntimeException("La vivienda seleccionada no pertenece o no existe en la comunidad.");
        } else if (vecino.getViviendas().contains(vivienda) || vivienda.getVecinos().contains(vecino)) {
            throw new RuntimeException("El vecino ya tiene esta vivienda correspondida.");
        }
    }

    public void rechazarSolicitud(Solicitud solicitud) {
        iSolicitudRepositorio.delete(solicitud);
    }

    public void enviarNotificacion(Integer[] idsVecinos, Integer idComunidad, TipoNotificacion tipo) {
        Comunidad comunidad = iComunidadRepositorio.findById(idComunidad)
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con este ID."));

        Set<Vecino> vecinos = new HashSet<>(0);
        for (Integer id : idsVecinos) {
            vecinos.add(iVecinoRepositorio.findById(id).orElseThrow(() -> new RuntimeException("No existe un vecino con este ID.")));
        }

        Notificacion n = new Notificacion();
        n.setVecinos(vecinos);
        n.setComunidad(comunidad);
        n.setTipo(tipo);
        n.setFecha(LocalDateTime.now());

        iNotificacionRepositorio.save(n);
    }


    public static ComunidadDTO getComunidadDTO(Comunidad c) {
        ComunidadDTO dto = new ComunidadDTO();
        dto.setId(c.getId());
        dto.setNombre(c.getNombre());
        dto.setDireccion(c.getDireccion());
        dto.setCif(c.getCIF());
        dto.setCodigoComunidad(c.getCodigoComunidad());

        if (c.getPresidente() != null) {
            dto.setIdPresidente(c.getPresidente().getId());
        }
        return dto;
    }
}
