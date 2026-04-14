package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.CrearEleccionDTO;
import org.example.backendlivetogether.DTOs.EleccionDTO;
import org.example.backendlivetogether.DTOs.EleccionDetDTO;
import org.example.backendlivetogether.Servicios.EleccionServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@AllArgsConstructor
public class EleccionControlador {

    private EleccionServicio eleccionServicio;

    @PostMapping("/comunidad/crear/eleccion")
    public void crearEleccion(@RequestBody CrearEleccionDTO crearEleccionDTO) {
        eleccionServicio.crearEleccion(crearEleccionDTO);
    }

    @GetMapping("/vecino/listar/elecciones/{idComunidad}")
    public List<EleccionDTO> listarElecciones(@PathVariable Integer idComunidad){
        return eleccionServicio.listarElecciones(idComunidad);
    }

    @GetMapping("/vecino/ver/eleccion/{idEleccion}")
    public EleccionDetDTO verEleccionID(@PathVariable Integer idEleccion){
        return eleccionServicio.getEleccion(idEleccion);
    }

    @GetMapping("/vecino/ver/total/voto/{idEleccion}")
    public Integer totalVoto(@PathVariable Integer idEleccion){
        return eleccionServicio.votosTotales(idEleccion);
    }

    @GetMapping("/comunidad/listar/elecciones/{idComunidad}")
    public List<EleccionDTO> listarEleccionesComunidad(@PathVariable Integer idComunidad){
        return eleccionServicio.listarElecciones(idComunidad);
    }

    @PutMapping("/comunidad/cerrar/eleccion/{idEleccion}")
    public void cerrarEleccion(@PathVariable Integer idEleccion) {
        eleccionServicio.cerrarEleccion(idEleccion);
    }

    @GetMapping("/comunidad/ver/total/voto/{idEleccion}")
    public Integer totalVotoComunidad(@PathVariable Integer idEleccion){
        return eleccionServicio.votosTotales(idEleccion);
    }

    @GetMapping("/comunidad/ver/eleccion/{idEleccion}")
    public EleccionDetDTO verEleccionIDComunidad(@PathVariable Integer idEleccion){
        return eleccionServicio.getEleccion(idEleccion);
    }



}
