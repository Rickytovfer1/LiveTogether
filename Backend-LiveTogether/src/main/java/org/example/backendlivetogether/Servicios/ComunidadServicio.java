package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.ComunidadDTO;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ComunidadServicio {

    private IComunidadRepositorio iComunidadRepositorio;

    public ComunidadDTO verComunnidadID(Integer idComunidad){
        Comunidad comunidad = iComunidadRepositorio.findById(idComunidad)
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con este ID."));
        return getComunidadDTO(comunidad);
    }

    public ComunidadDTO verComunidadUsuarioID(Integer idUsuario) {
        Comunidad comunidad = iComunidadRepositorio.findByUsuario_Id(idUsuario);

        return getComunidadDTO(comunidad);
    }


    public List<ComunidadDTO> listarComunidades(){
        List<Comunidad> comunidads = iComunidadRepositorio.findAll();
        List<ComunidadDTO> comunidadDTOS = new ArrayList<>();

        for (Comunidad comunidad: comunidads){
            comunidadDTOS.add(getComunidadDTO(comunidad));
        }

        return comunidadDTOS;
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
