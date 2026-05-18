package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.EditarViviendaDTO;
import org.example.backendlivetogether.DTOs.RegistrarViviendaDTO;
import org.example.backendlivetogether.DTOs.VecinoDTO;
import org.example.backendlivetogether.DTOs.ViviendaDTO;
import org.example.backendlivetogether.Servicios.ViviendaServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping()
@AllArgsConstructor
public class ViviendaControlador {
    private ViviendaServicio viviendaServicio;

    @PostMapping("/comunidad/crear/vivienda")
    public void crearVivienda(@RequestBody RegistrarViviendaDTO registrarViviendaDTO){
        viviendaServicio.crearVivienda(registrarViviendaDTO);
    }

    @GetMapping("/vecino/listar/viviendas/{idComunidad}")
    public List<ViviendaDTO> listarViviendas(@PathVariable Integer idComunidad){
        return viviendaServicio.listarViviendas(idComunidad);
    }

    @GetMapping("/comunidad/listar/viviendas/{idComunidad}")
    public List<ViviendaDTO> listarViviendasComunidad(@PathVariable Integer idComunidad){
        return viviendaServicio.listarViviendas(idComunidad);
    }

    @GetMapping("/comunidad/ver/info/vivienda/{idVivienda}")
    public ViviendaDTO verInfoVivienda(@PathVariable Integer idVivienda){
        return viviendaServicio.verViviendaID(idVivienda);
    }

    @GetMapping("/numero/propietarios/{idComunidad}")
    public Integer numeroPropietarios(@PathVariable Integer idComunidad){
        return viviendaServicio.numeroPropietarios(idComunidad);
    }

    @GetMapping("/vecino/listar/residentes/{idVivienda}")
    public Set<VecinoDTO> listarResidentes(@PathVariable Integer idVivienda){
        return viviendaServicio.listarResidentes(idVivienda);
    }

    @GetMapping("/comunidad/listar/residentes/{idVivienda}")
    public Set<VecinoDTO> listarResidentesComunidad(@PathVariable Integer idVivienda){
        return viviendaServicio.listarResidentes(idVivienda);
    }


    @PostMapping("comunidad/asginar/propietario/vivienda/{idVivienda}/{idPropietario}")
    public void asignarPropietarioVivienda(@PathVariable Integer idVivienda, @PathVariable Integer idPropietario){
        viviendaServicio.asignarPropietarioVivienda(idVivienda, idPropietario);
    }

    @PostMapping("/comunidad/editar/vivienda/{idVivienda}")
    public void editarVivienda(@RequestBody EditarViviendaDTO editarViviendaDTO, @PathVariable Integer idVivienda){
        viviendaServicio.editarNombreVivienda(editarViviendaDTO, idVivienda);
    }

    @PostMapping("/comunidad/{idVivienda}/residentes/{idResidente}")
    public void eliminarResidente(@PathVariable Integer idVivienda, @PathVariable Integer idResidente) {
        viviendaServicio.eliminarResidente(idVivienda, idResidente);
    }
}
