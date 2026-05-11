package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EleccionDetDTO {
    private String motivo;
    private LocalDateTime fecha;
    private boolean abierta;
    private Integer totalAFavor;
    private Integer totalEnContra;
    private Integer totalAbstencion;
}