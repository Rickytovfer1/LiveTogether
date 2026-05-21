package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.*;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Gasto;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.IGastoRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class GastoServicio {

    private IGastoRepositorio iGastoRepositorio;

    private IComunidadRepositorio iComunidadRepositorio;

    private IVecinoRepositorio iVecinoRepositorio;

    private VecinoServicio vecinoServicio;

    public void crearGasto(CrearGastoDTO crearGastoDTO){

        Gasto nuevoGasto = new Gasto();

        nuevoGasto.setConcepto(crearGastoDTO.getConcepto());
        nuevoGasto.setTotal(crearGastoDTO.getTotal());
        nuevoGasto.setCantidadPagada(0.0);
        nuevoGasto.setVecinosPagados(new HashSet<>(0));
        nuevoGasto.setVecinosPendientes(new HashSet<>(0));
        nuevoGasto.setFechaHora(LocalDateTime.now());

        Comunidad comunidad = iComunidadRepositorio.findById(crearGastoDTO.getIdComunidad())
                .orElseThrow(()-> new RuntimeException("No existe una comunidad con este ID."));

        nuevoGasto.setComunidad(comunidad);

        iGastoRepositorio.save(nuevoGasto);

        Set<Vecino> vecinos = new HashSet<>(0);
        for (VecinoUsuarioDTO v : vecinoServicio.listarPropietarios(crearGastoDTO.getIdComunidad())) {
            Vecino vecino = iVecinoRepositorio.findById(v.getId())
                    .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));
            vecinos.add(vecino);
            System.out.println(nuevoGasto);
            vecino.getGastosPendientes().add(nuevoGasto);
            iVecinoRepositorio.save(vecino);
        }

        nuevoGasto.setVecinosPendientes(vecinos);

        iGastoRepositorio.save(nuevoGasto);
    }

    public GastoDTO verGasto(Integer idGasto){
        Gasto gasto = iGastoRepositorio.findById(idGasto)
                .orElseThrow(()-> new RuntimeException("No existe un gasto con este ID."));

        return getGastoDTO(gasto);
    }

    public List<GastoDTO> listarGastos(Integer idComunidad) {
        Comunidad comunidad = iComunidadRepositorio.findById(idComunidad)
                .orElseThrow(()-> new RuntimeException("No existe una comunidad con este ID."));

        List<GastoDTO> listaGastos = new ArrayList<>();

        for (Gasto gasto : iGastoRepositorio.findAll()) {
            if (gasto.getComunidad().equals(comunidad)) {
                listaGastos.add(getGastoDTO(gasto));
            }
        }

        return listaGastos;
    }

    public double calcularPorcentajePagado(Integer idGasto) {
        Gasto gasto = iGastoRepositorio.findById(idGasto)
                .orElseThrow(() -> new RuntimeException("No existe un gasto con este ID."));

        int totalVecinos = gasto.getVecinosPendientes().size() + gasto.getVecinosPagados().size();

        int vecinosPendientes = gasto.getVecinosPendientes().size();

        if (totalVecinos == 0) {
            return 0.0;
        }

        return (1 - ((double) vecinosPendientes / totalVecinos)) * 100;
    }

    public void marcarPagado(MarcarPagadoDTO dto){
        Gasto gasto = iGastoRepositorio.findById(dto.getIdGasto())
                .orElseThrow(() -> new RuntimeException("No existe un gasto con este ID."));

        Vecino vecino = iVecinoRepositorio.findById(dto.getIdVecino())
                .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

        if (!gasto.getVecinosPendientes().contains(vecino) && gasto.getVecinosPagados().contains(vecino)) {
            throw new RuntimeException("Este vecino ya ha pagado o no le corresponde el pago.");
        }

        Integer totalVecinosDelGasto = gasto.getVecinosPendientes().size() + gasto.getVecinosPagados().size();
        double totalPorVecino;

        if (totalVecinosDelGasto > 0){
            totalPorVecino = gasto.getTotal() / totalVecinosDelGasto;

            gasto.getVecinosPendientes().remove(vecino);
            vecino.getGastosPendientes().remove(gasto);

            gasto.getVecinosPagados().add(vecino);
            vecino.getGastosPagados().add(gasto);

            gasto.setCantidadPagada(gasto.getCantidadPagada() + totalPorVecino);

            iGastoRepositorio.save(gasto);
            iVecinoRepositorio.save(vecino);
        }
    }

    public List<VecinoGastosDTO> listarDeudoresIdComunidad(Integer idComunidad) {
        List<VecinoGastosDTO> listaDeudores = new ArrayList<>();

        List<VecinoUsuarioDTO> vecinos = vecinoServicio.listarVecinosIdComunidad(idComunidad);

        for (VecinoUsuarioDTO v : vecinos) {

            Vecino vecino = iVecinoRepositorio.findById(v.getId())
                    .orElseThrow(() -> new RuntimeException("No existe un vecino con este ID."));

            if (!vecino.getGastosPendientes().isEmpty()) {

                Set<GastoDTO> gastosPagados = new HashSet<>(0);
                for (Gasto g : vecino.getGastosPagados()) {
                    gastosPagados.add(getGastoDTO(g));
                }

                Set<GastoDTO> gastosPendientes = new HashSet<>(0);
                for (Gasto g : vecino.getGastosPendientes()) {
                    gastosPendientes.add(getGastoDTO(g));
                }

                VecinoGastosDTO dto = new VecinoGastosDTO();
                dto.setId(vecino.getId());
                dto.setNombre(vecino.getNombre());
                dto.setApellidos(vecino.getApellidos());
                dto.setTelefono(vecino.getTelefono());
                dto.setFechaNacimiento(vecino.getFechaNacimiento());
                dto.setDni(vecino.getDni());
                dto.setFotoPerfil(vecino.getFotoPerfil());
                dto.setGastosPagados(gastosPagados);
                dto.setGastosPendientes(gastosPendientes);

                listaDeudores.add(dto);
            }
        }

        return listaDeudores;
    }

    public List<VecinoDTO> listarDeudores(Integer idGasto) {
        Gasto gasto = iGastoRepositorio.findById(idGasto)
                .orElseThrow(() -> new RuntimeException("No existe un gasto con este ID."));

        List<VecinoDTO> deudoresDTO = new ArrayList<>();

        for (Vecino vecino : gasto.getVecinosPendientes()) {
            deudoresDTO.add(VecinoServicio.getVecinoDTO(vecino));
        }

        return deudoresDTO;
    }

    public static GastoDTO getGastoDTO(Gasto g) {
        GastoDTO dto = new GastoDTO();
        dto.setId(g.getId());
        dto.setConcepto(g.getConcepto());
        dto.setTotal(g.getTotal());
        dto.setCantidadPagada(g.getCantidadPagada());

        Set<Integer> pagadosID = new HashSet<>();
        for (Vecino vecino : g.getVecinosPagados()) {
            pagadosID.add(vecino.getId());
        }
        dto.setPagados(pagadosID);

        Set<Integer> pendientesID = new HashSet<>();
        for (Vecino vecino : g.getVecinosPendientes()) {
            pendientesID.add(vecino.getId());
        }
        dto.setPendientes(pendientesID);

        dto.setIdComunidad(g.getComunidad().getId());

        return dto;
    }
}
