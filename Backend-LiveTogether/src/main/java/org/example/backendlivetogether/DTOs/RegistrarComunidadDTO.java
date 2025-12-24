package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrarComunidadDTO {
    private String nombre;
    private String direccion;
    private String cif;
    private Integer idPresidente;

    private String correo;
    private String contrasena;
}
