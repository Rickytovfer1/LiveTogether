package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.ComunidadDTO;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.Vivienda;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class ComunidadServicio {

    private IComunidadRepositorio iComunidadRepositorio;

    private IVecinoRepositorio iVecinoRepositorio;

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
