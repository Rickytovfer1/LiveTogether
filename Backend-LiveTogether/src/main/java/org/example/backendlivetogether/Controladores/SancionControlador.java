package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.CrearSancionComunidadDTO;
import org.example.backendlivetogether.DTOs.SancionDTO;
import org.example.backendlivetogether.Servicios.SancionServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping()
@AllArgsConstructor
public class SancionControlador {

    private SancionServicio sancionServicio;

    @GetMapping("/comunidad/listar/sanciones/{idComunidad}")
    public List<SancionDTO> listarSancionComunidad (@PathVariable Integer idComunidad){
        return sancionServicio.listarSanciones(idComunidad);
    }

    @GetMapping("/vecino/listar/sanciones/{idComunidad}")
    public List<SancionDTO> listarSancionVecino (@PathVariable Integer idComunidad){
        return sancionServicio.listarSanciones(idComunidad);
    }

    @GetMapping("/vecino/listar/sanciones/vecino/{idComunidad}/{idVecino}")
    public List<SancionDTO> listarSancionVecino (@PathVariable Integer idComunidad, @PathVariable Integer idVecino){
        return sancionServicio.listarSancionesVecino(idComunidad, idVecino);
    }

    @GetMapping("/comunidad/listar/sanciones/vecino/{idComunidad}/{idVecino}")
    public List<SancionDTO> listarSancionVecinoComunidad (@PathVariable Integer idComunidad, @PathVariable Integer idVecino){
        return sancionServicio.listarSancionesVecino(idComunidad, idVecino);
    }

    @PostMapping("/comunidad/crear/sancion")
    public void crearSancionComunidad(@RequestBody CrearSancionComunidadDTO sancionDTO){
        sancionServicio.crearSancionComunidad(sancionDTO);
    }

    @PostMapping("/comunidad/eliminar/sancion/{idSancion}")
    public void eliminarSancion(@PathVariable Integer idSancion) {
        sancionServicio.eliminarSancion(idSancion);
    }
}