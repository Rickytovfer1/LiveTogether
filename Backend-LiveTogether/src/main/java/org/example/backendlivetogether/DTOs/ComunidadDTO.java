package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComunidadDTO {
    private Integer id;
    private String nombre;
    private String direccion;
    private String cif;
    private String codigoComunidad;
    private Integer idPresidente;
}
