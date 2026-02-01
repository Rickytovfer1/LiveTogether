package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.VecinoDTO;
import org.example.backendlivetogether.DTOs.VecinoUsuarioDTO;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.Vivienda;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.example.backendlivetogether.Repositorios.IViviendaRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class VecinoServicio {

    private IVecinoRepositorio iVecinoRepositorio;

    private IViviendaRepositorio iViviendaRepositorio;

    public VecinoDTO verVecinoID(Integer idVecino){
        Vecino vecino = iVecinoRepositorio.findById(idVecino)
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));
        return getVecinoDTO(vecino);
    }

    public VecinoDTO verVecinoUsuarioID(Integer idUsuario){
        Vecino vecino = iVecinoRepositorio.findByUsuario_Id(idUsuario);

        return getVecinoDTO(vecino);
    }

    public List<VecinoDTO> listarVecinos(){
        List<Vecino> vecinos = iVecinoRepositorio.findAll();
        List<VecinoDTO> vecinosDTOS = new ArrayList<>();

        for (Vecino vecino: vecinos){
            vecinosDTOS.add(getVecinoDTO(vecino));
        }

        return  vecinosDTOS;

    }

    public List<VecinoUsuarioDTO> listarVecinosIdComunidad(Integer idComunidad){
        List<Vivienda> viviendas = iViviendaRepositorio.findByComunidad_Id(idComunidad);
        List<VecinoUsuarioDTO> vecinoDTOS = new ArrayList<>();
        for (Vivienda vivienda: viviendas){
            Set<Vecino> residentes = vivienda.getVecinos();

            for (Vecino vecino: residentes){
                vecinoDTOS.add(getVecinoUsuarioDTO(vecino));
            }
        }

        return vecinoDTOS;
    }

    public VecinoUsuarioDTO getVecinoUsuarioDTO(Vecino vecino){
        VecinoUsuarioDTO dtoNuevo  = new VecinoUsuarioDTO();

        dtoNuevo.setId(vecino.getId());
        dtoNuevo.setNombre(vecino.getNombre());
        dtoNuevo.setApellidos(vecino.getApellidos());
        dtoNuevo.setDni(vecino.getDni());
        dtoNuevo.setTelefono(vecino.getTelefono());
        dtoNuevo.setFechaNacimiento(vecino.getFechaNacimiento());
        if (vecino.getFotoPerfil() != null){
            dtoNuevo.setFotoPerfil(vecino.getFotoPerfil());
        }
        dtoNuevo.setIdUsuario(vecino.getUsuario().getId());
        return dtoNuevo;
    }

    public static VecinoDTO getVecinoDTO(Vecino vecino){
        VecinoDTO dtoNuevo  = new VecinoDTO();

        dtoNuevo.setId(vecino.getId());
        dtoNuevo.setNombre(vecino.getNombre());
        dtoNuevo.setApellidos(vecino.getApellidos());
        dtoNuevo.setDni(vecino.getDni());
        dtoNuevo.setTelefono(vecino.getTelefono());
        dtoNuevo.setFechaNacimiento(vecino.getFechaNacimiento());
        if (vecino.getFotoPerfil() != null){
            dtoNuevo.setFotoPerfil(vecino.getFotoPerfil());
        }
        return dtoNuevo;
    }

}
