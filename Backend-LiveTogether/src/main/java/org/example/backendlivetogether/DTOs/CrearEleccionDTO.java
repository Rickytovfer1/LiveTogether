package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearEleccionDTO {
    private String motivo;
    private LocalDateTime fechaHora;
    private Integer idComunidad;
    private Integer idCandidato;
}
