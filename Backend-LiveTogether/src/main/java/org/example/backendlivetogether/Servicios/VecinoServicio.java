package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.*;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.Vivienda;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.example.backendlivetogether.Repositorios.IViviendaRepositorio;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@AllArgsConstructor
public class VecinoServicio {

    private IVecinoRepositorio iVecinoRepositorio;

    private IViviendaRepositorio iViviendaRepositorio;

    private ViviendaServicio viviendaServicio;

    private IComunidadRepositorio iComunidadRepositorio;

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

    public List<VecinoUsuarioDTO> listarPropietarios(Integer idComunidad) {
        List<ViviendaDTO> viviendas = viviendaServicio.listarViviendas(idComunidad);

        List<VecinoUsuarioDTO> propietarios = new ArrayList<>();
        for (VecinoUsuarioDTO vecino : listarVecinosIdComunidad(idComunidad)) {
            for (ViviendaDTO vivienda : viviendas) {
                if (Objects.equals(vivienda.getIdPropietario(), vecino.getId())) {
                    propietarios.add(vecino);
                }
            }
        }

        return propietarios;
    }

    public void insertarCodigoComunidad(InsertarCodigoDTO insertarCodigoDTO) {
        Vecino vecino = iVecinoRepositorio.findById(insertarCodigoDTO.getIdVecino())
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

        boolean encontrado = false;

        for (Comunidad comunidad : iComunidadRepositorio.findAll()) {
            if (comunidad.getCodigoComunidad() != null &&
                    comunidad.getCodigoComunidad().equals(insertarCodigoDTO.getCodigoComunidad())) {

                String dirViviendaEncoded = insertarCodigoDTO.getCodigoComunidad().substring(6);
                byte[] decodedBytes = Base64.getDecoder().decode(dirViviendaEncoded);
                String dirVivienda = new String(decodedBytes, StandardCharsets.UTF_8);

                System.out.println(dirVivienda);

                for (Vivienda vivienda : iViviendaRepositorio.findAll()) {
                    if (vivienda.getDireccionPersonal().equals(dirVivienda)) {
                        System.out.println("encontrado");
                        vivienda.getVecinos().add(vecino);
                        iViviendaRepositorio.save(vivienda);

                        vecino.getViviendas().add(vivienda);
                        iVecinoRepositorio.save(vecino);

                        comunidad.setCodigoComunidad(null);
                        iComunidadRepositorio.save(comunidad);

                        encontrado = true;
                        break;
                    }
                }

                if (encontrado) break;
            }
        }

        if (!encontrado) {
            throw new RuntimeException("Código incorrecto.");
        }
    }

    public ComunidadDTO buscarComunidadPorCodigo(String codigo) {
        return ComunidadServicio.getComunidadDTO(iComunidadRepositorio.findByCodigoComunidad(codigo));
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
