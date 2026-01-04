package org.example.backendlivetogether.Controladores;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.MensajeDTO;
import org.example.backendlivetogether.Servicios.MensajeServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vecino/mensaje")
@AllArgsConstructor
public class MensajeControlador {
    private MensajeServicio mensajeServicio;

    @PostMapping("/enviar")
    public ResponseEntity<Void> enviarMensaje(@RequestBody MensajeDTO dto){
        mensajeServicio.enviarMensaje(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/ver/{idEmisor}/{idReceptor}")
    public ResponseEntity<List<MensajeDTO>> verMensajes(@PathVariable Integer idEmisor, @PathVariable Integer idReceptor){
        List<MensajeDTO> mensajes = mensajeServicio.mostrarConversacion(idEmisor, idReceptor);
        return ResponseEntity.ok(mensajes);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<MensajeDTO> editarMensaje(@PathVariable Integer id, @RequestBody Map<String, String> body){
        String nuevoTexto = body.get("texto");
        if(nuevoTexto == null || nuevoTexto.trim().isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        MensajeDTO mensajeEditado = mensajeServicio.editarMensaje(id, nuevoTexto.trim());
        return ResponseEntity.ok(mensajeEditado);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<MensajeDTO> eliminarMensaje(@PathVariable Integer id){
        MensajeDTO mensajeEliminado = mensajeServicio.eliminarMensaje(id);
        return ResponseEntity.ok(mensajeEliminado);
    }
}
