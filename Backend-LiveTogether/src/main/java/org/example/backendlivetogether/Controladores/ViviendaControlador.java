package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.RegistrarViviendaDTO;
import org.example.backendlivetogether.DTOs.ViviendaDTO;
import org.example.backendlivetogether.Servicios.ViviendaServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
