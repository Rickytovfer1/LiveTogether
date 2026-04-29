package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.CrearSancionComunidadDTO;
import org.example.backendlivetogether.DTOs.SancionDTO;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Sancion;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.ISancionRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class SancionServicio {

    private ISancionRepositorio iSancionRepositorio;
    private IVecinoRepositorio iVecinoRepositorio;
    private IComunidadRepositorio iComunidadRepositorio;

    public List<SancionDTO> listarSanciones(Integer idComunidad) {
        List<SancionDTO> listaSanciones = new ArrayList<>();
        for (Sancion sancion : iSancionRepositorio.findAll()) {
            if (sancion.getComunidad().getId().equals(idComunidad)) {
                listaSanciones.add(getSancionoDTO(sancion));
            }
        }
        return listaSanciones;
    }

    public void crearSancionComunidad(CrearSancionComunidadDTO sancionDTO) {
        Sancion sancion = new Sancion();
        sancion.setMotivo(sancionDTO.getMotivo());
        sancion.setSancion(sancionDTO.getSancion());

        Assert.notNull(sancionDTO.getIdComunidad(), "El id de la comunidad no debe ser nulo");
        Comunidad comunidad = iComunidadRepositorio.findById(sancionDTO.getIdComunidad())
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con ese ID."));
        Assert.notNull(sancionDTO.getIdVecino(), "El id del vecino no debe ser nulo");
        Vecino vecino = iVecinoRepositorio.findById(sancionDTO.getIdVecino())
                .orElseThrow(() -> new RuntimeException("No existe un vecino con ese ID."));

        sancion.setComunidad(comunidad);
        sancion.setVecinoAfectado(vecino);

        iSancionRepositorio.save(sancion);
    }

    public List<SancionDTO> listarSancionesVecino(Integer idComunidad, Integer idVecino) {
        List<SancionDTO> listaSanciones = new ArrayList<>();
        for (Sancion sancion : iSancionRepositorio.findAll()) {
            if (sancion.getComunidad().getId().equals(idComunidad) && sancion.getVecinoAfectado().getId().equals(idVecino)) {
                listaSanciones.add(getSancionoDTO(sancion));
            }
        }
        return listaSanciones;
    }

    public void eliminarSancion(Integer idSancion) {
        Sancion sancion = iSancionRepositorio.findById(idSancion)
                .orElseThrow(() -> new RuntimeException("Sanción no encontrada"));
        iSancionRepositorio.delete(sancion);
    }

    public static SancionDTO getSancionoDTO(Sancion s) {
        SancionDTO dto = new SancionDTO();
        dto.setId(s.getId());
        dto.setMotivo(s.getMotivo());
        dto.setSancion(s.getSancion());
        dto.setIdVecino(s.getVecinoAfectado().getId());
        dto.setIdComunidad(s.getComunidad().getId());
        return dto;
    }
}
