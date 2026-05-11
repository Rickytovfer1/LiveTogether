package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EleccionDTO {
    private Integer id;
    private String motivo;
    private LocalDateTime fecha;
    private LocalDateTime fechaHoraCreacion;
    private boolean abierta;
}
