package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.*;
import org.example.backendlivetogether.Servicios.GastoServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class GastoControlador {

    private GastoServicio gastoServicio;


    @PostMapping("/comunidad/crear/gasto")
    public void crearGasto(@RequestBody CrearGastoDTO crearGastoDTO){
        gastoServicio.crearGasto(crearGastoDTO);
    }

    @GetMapping("/vecino/listar/gastos/{idComunidad}")
    public List<GastoDTO> listarGastos(@PathVariable Integer idComunidad){
        return gastoServicio.listarGastos(idComunidad);
    }

    @GetMapping("/comunidad/listar/gastos/{idComunidad}")
    public List<GastoDTO> listarGastosComunidad(@PathVariable Integer idComunidad){
        return gastoServicio.listarGastos(idComunidad);
    }

    @GetMapping("/vecino/ver/gasto/{idGasto}")
    public GastoDTO verGasto(@PathVariable Integer idGasto){
        return gastoServicio.verGasto(idGasto);
    }

    @GetMapping("/comunidad/ver/gasto/{idGasto}")
    public GastoDTO verGastoComunidad(@PathVariable Integer idGasto){
        return gastoServicio.verGasto(idGasto);
    }

    @GetMapping("/calcular/porcentaje/{idGasto}")
    public double calcularPorcentajePagado(@PathVariable Integer idGasto){
        return gastoServicio.calcularPorcentajePagado(idGasto);
    }

    @PostMapping("/marcar/pagado")
    public void marcarPagado(@RequestBody MarcarPagadoDTO dto){
        gastoServicio.marcarPagado(dto);
    }

    @GetMapping("/comunidad/listar/deudores/comunidad/{idComunidad}")
    public List<VecinoGastosDTO> listarDeudoresIdComunidad(@PathVariable Integer idComunidad){
        return gastoServicio.listarDeudoresIdComunidad(idComunidad);
    }

    @GetMapping("/vecino/listar/deudores/comunidad/{idComunidad}")
    public List<VecinoGastosDTO> listarDeudoresIdComunidadVecino(@PathVariable Integer idComunidad){
        return gastoServicio.listarDeudoresIdComunidad(idComunidad);
    }

    @GetMapping("/comunidad/listar/deudores/{idGasto}")
    public List<VecinoDTO> listarDeudoresIdGasto(@PathVariable Integer idGasto){
        return gastoServicio.listarDeudores(idGasto);
    }

}
