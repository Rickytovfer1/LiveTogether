package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearSancionComunidadDTO {
    private String motivo;
    private String sancion;
    private Integer idVecino;
    private Integer idComunidad;
}