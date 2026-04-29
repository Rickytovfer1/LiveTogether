package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SancionDTO {
    private Integer id;
    private String motivo;
    private String sancion;
    private Integer idVecino;
    private Integer idComunidad;
}
