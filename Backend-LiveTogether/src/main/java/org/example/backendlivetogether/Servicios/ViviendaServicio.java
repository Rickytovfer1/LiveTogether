package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.ComunidadDTO;
import org.example.backendlivetogether.DTOs.RegistrarViviendaDTO;
import org.example.backendlivetogether.DTOs.ViviendaDTO;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.Vivienda;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.example.backendlivetogether.Repositorios.IViviendaRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ViviendaServicio {

    private IViviendaRepositorio iViviendaRepositorio;

    private IComunidadRepositorio iComunidadRepositorio;

    public ViviendaDTO verViviendaID(Integer idVivienda){
        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));
        return getViviendaDTO(vivienda);

    }

    public void crearVivienda(RegistrarViviendaDTO dto) {
        Vivienda vivienda = new Vivienda();
        vivienda.setDireccionPersonal(dto.getDireccionPersonal());
        vivienda.setNumResidentes(0);
        Comunidad comunidad = iComunidadRepositorio.findById(dto.getIdComunidad())
                .orElseThrow(() -> new RuntimeException("No existe una comunidad con este ID."));
        vivienda.setComunidad(comunidad);

        iViviendaRepositorio.save(vivienda);

    }

    public List<ViviendaDTO> listarViviendas(Integer idComunidad){

        List<Vivienda> viviendas = iViviendaRepositorio.findByComunidad_Id(idComunidad);
        List<ViviendaDTO> viviendasDTO = new ArrayList<>();

        for (Vivienda v : viviendas) {
            viviendasDTO.add(getViviendaDTO(v));
        }

        return viviendasDTO;

    }

    public Integer numeroPropietarios(Integer idComunidad){
        List<Vivienda> viviendas = iViviendaRepositorio.findByComunidad_Id(idComunidad);
        int propietarios = 0;

        for (Vivienda vivienda : viviendas){
            if (vivienda.getPropietario() != null) {
                propietarios++;
            }
        }

        return propietarios;
    }

    public static ViviendaDTO getViviendaDTO(Vivienda v) {
        ViviendaDTO dto = new ViviendaDTO();
        dto.setId(v.getId());
        dto.setNumResidentes(v.getNumResidentes());
        dto.setDireccionPersonal(v.getDireccionPersonal());

        if (v.getPropietario() != null) {
            dto.setIdPropietario(v.getPropietario().getId());
        }

        if (v.getComunidad() != null) {
            dto.setIdComunidad(v.getComunidad().getId());
        }

        List<Integer> idVecinos = new ArrayList<>();
        for (Vecino vecino : v.getVecinos()) {
            idVecinos.add(vecino.getId());
        }

        if (!idVecinos.isEmpty()) {
            dto.setIdVecinos(idVecinos);
        }
        return dto;
    }
}
