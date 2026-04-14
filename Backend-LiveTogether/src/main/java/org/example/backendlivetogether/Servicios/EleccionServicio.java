package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.CrearEleccionDTO;
import org.example.backendlivetogether.DTOs.EleccionDTO;
import org.example.backendlivetogether.DTOs.EleccionDetDTO;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Eleccion;
import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.IEleccionRepositorio;
import org.example.backendlivetogether.Repositorios.IUsuarioRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class EleccionServicio {

    private IEleccionRepositorio iEleccionRepositorio;

    private IComunidadRepositorio iComunidadRepositorio;

    private IVecinoRepositorio iVecinoRepositorio;

    private IUsuarioRepositorio iUsuarioRepositorio;

    private EmailServicio emailServicio;

    public void crearEleccion(CrearEleccionDTO crearEleccionDTO){

        Eleccion nuevaEleccion = new Eleccion();
        nuevaEleccion.setMotivo(crearEleccionDTO.getMotivo());
        nuevaEleccion.setFechaHora(crearEleccionDTO.getFechaHora());
        nuevaEleccion.setFechaHoraCreacion(LocalDateTime.now());
        nuevaEleccion.setTotalAFavor(0);
        nuevaEleccion.setTotalAbstencion(0);
        nuevaEleccion.setTotalEnContra(0);
        nuevaEleccion.setAbierta(true);

        if (crearEleccionDTO.getIdCandidato() != null){
            Vecino vecino = iVecinoRepositorio.findById(crearEleccionDTO.getIdCandidato())
                    .orElseThrow(()-> new RuntimeException("No existe un vecino con este ID."));
            nuevaEleccion.setVecino(vecino);
        }

        Comunidad comunidad = iComunidadRepositorio.findById(crearEleccionDTO.getIdComunidad())
                .orElseThrow(()-> new RuntimeException("No existe una comunidad con este ID."));
        nuevaEleccion.setComunidad(comunidad);

        iEleccionRepositorio.save(nuevaEleccion);

    }

    public List<EleccionDTO> listarElecciones(Integer idComunidad) {
        Comunidad comunidad = iComunidadRepositorio.findById(idComunidad)
                .orElseThrow(()-> new RuntimeException("No existe una comunidad con este ID."));

        List<EleccionDTO> listaElecciones = new ArrayList<>();

        for (Eleccion eleccion : iEleccionRepositorio.findAll()) {
            if (eleccion.getComunidad().equals(comunidad)) {

                if (eleccion.isAbierta() && eleccion.getFechaHora() != null && LocalDateTime.now().isAfter(eleccion.getFechaHora())) {
                    eleccion.setAbierta(false);
                    iEleccionRepositorio.save(eleccion);
                    if (!eleccion.isAbierta() && eleccion.getVecino().getId() != null &&
                            eleccion.getTotalAFavor() > eleccion.getTotalEnContra() &&
                            eleccion.getTotalAFavor() > eleccion.getTotalAbstencion()) {

                        Vecino nuevoPresidente = iVecinoRepositorio.findById(eleccion.getVecino().getId())
                                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

                        comunidad.setPresidente(nuevoPresidente);
                        iComunidadRepositorio.save(comunidad);

                        Usuario usuario = iUsuarioRepositorio.findById(nuevoPresidente.getUsuario().getId())
                                .orElseThrow(()-> new RuntimeException("No existe un usuario con este ID."));

                        emailServicio.nuevoPresidente(usuario.getCorreo(), idComunidad);
                    }
                }

                listaElecciones.add(getEleccionDTO(eleccion));
            }
        }

        return listaElecciones;
    }

    public Integer votosTotales(Integer idEleccion){
        Eleccion eleccion = iEleccionRepositorio.findById(idEleccion)
                .orElseThrow(()-> new RuntimeException("No existe una elección con este ID."));
        return eleccion.getTotalAFavor() + eleccion.getTotalEnContra() + eleccion.getTotalAbstencion();
    }

    public void cerrarEleccion(Integer idEleccion){
        Eleccion eleccion = iEleccionRepositorio.findById(idEleccion)
                .orElseThrow(()-> new RuntimeException("No existe una elección con este ID."));
        eleccion.setAbierta(false);
        iEleccionRepositorio.save(eleccion);
    }

    public EleccionDetDTO getEleccion(Integer idEleccion) {
        Eleccion eleccion = iEleccionRepositorio.findById(idEleccion)
                .orElseThrow(()-> new RuntimeException("No existe una elección con este ID."));

        return getEleccionDetDTO(eleccion);
    }

    public static EleccionDTO getEleccionDTO(Eleccion e) {
        EleccionDTO dto = new EleccionDTO();
        dto.setId(e.getId());
        dto.setMotivo(e.getMotivo());
        dto.setFecha(e.getFechaHora());
        dto.setFechaHoraCreacion(e.getFechaHoraCreacion());
        dto.setAbierta(e.isAbierta());
        return dto;
    }

    public static EleccionDetDTO getEleccionDetDTO(Eleccion e) {
        EleccionDetDTO dto = new EleccionDetDTO();
        dto.setMotivo(e.getMotivo());
        dto.setFecha(e.getFechaHora());
        dto.setAbierta(e.isAbierta());
        dto.setTotalAFavor(e.getTotalAFavor());
        dto.setTotalEnContra(e.getTotalEnContra());
        dto.setTotalAbstencion(e.getTotalAbstencion());
        return dto;
    }
}
