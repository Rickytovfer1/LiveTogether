package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditarVecinoDTO {
    private String nombre;
    private String apellidos;
    private String telefono;
    private String fechaNacimiento;
    private String dni;
    private String fotoPerfil;
}
