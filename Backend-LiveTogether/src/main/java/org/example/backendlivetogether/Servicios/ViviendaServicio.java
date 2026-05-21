package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.*;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Sancion;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.Vivienda;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.ISancionRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.example.backendlivetogether.Repositorios.IViviendaRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class ViviendaServicio {

    private IViviendaRepositorio iViviendaRepositorio;

    private IComunidadRepositorio iComunidadRepositorio;

    private IVecinoRepositorio iVecinoRepositorio;

    private ISancionRepositorio iSancionRepositorio;

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

    public Set<VecinoDTO> listarResidentes(Integer idVivienda){
        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));

        Set<Vecino> residentes = vivienda.getVecinos();
        Set<VecinoDTO> vecinoDTOS = new HashSet<>();


        for (Vecino vecino: residentes){
            vecinoDTOS.add(VecinoServicio.getVecinoDTO(vecino));
        }

        return vecinoDTOS;

    }

    public void asignarPropietarioVivienda(Integer idVivienda, Integer idPropietario) {
        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));
        Vecino propietario = iVecinoRepositorio.findById(idPropietario)
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

        vivienda.setPropietario(propietario);
        iViviendaRepositorio.save(vivienda);
    }

    public void editarNombreVivienda(EditarViviendaDTO editarViviendaDTO, Integer idVivienda){
        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));
        vivienda.setDireccionPersonal(editarViviendaDTO.getDireccionPersonal());
        iViviendaRepositorio.save(vivienda);
    }

    public void eliminarResidente(Integer idVivienda, Integer idResidente) {
        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("Vivienda no encontrada"));

        Vecino residente = iVecinoRepositorio.findById(idResidente)
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        Comunidad comunidad = iComunidadRepositorio.findById(vivienda.getComunidad().getId())
                .orElseThrow(() -> new RuntimeException("Comunidad no encontrada"));

        List<Sancion> sancions = iSancionRepositorio.findByComunidad_Id(comunidad.getId());

        if (!vivienda.getVecinos().contains(residente)) {
            throw new RuntimeException("El residente no pertenece a esta vivienda.");
        }

        if (vivienda.getPropietario() != null && vivienda.getPropietario().getId().equals(residente.getId())) {
            vivienda.setPropietario(null);
        }

        vivienda.getVecinos().remove(residente);
        residente.getViviendas().remove(vivienda);
        for (Sancion sancion: sancions){
            if (sancion.getVecinoAfectado() == residente){
                iSancionRepositorio.delete(sancion);
            }
        }

        if (comunidad.getPresidente() != null && residente.getId().equals(comunidad.getPresidente().getId())) {
            comunidad.setPresidente(null);
        }

        iViviendaRepositorio.save(vivienda);
        iVecinoRepositorio.save(residente);
        iComunidadRepositorio.save(comunidad);
    }

    public void asignarViviendaVecino(Integer idVivienda, Integer idVecino) {
        Vivienda vivienda = iViviendaRepositorio.findById(idVivienda)
                .orElseThrow(() -> new RuntimeException("No existe una vivienda con este ID."));
        Vecino vecino = iVecinoRepositorio.findById(idVecino)
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

        vivienda.getVecinos().add(vecino);
        vecino.getViviendas().add(vivienda);

        iViviendaRepositorio.save(vivienda);
        iVecinoRepositorio.save(vecino);
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
