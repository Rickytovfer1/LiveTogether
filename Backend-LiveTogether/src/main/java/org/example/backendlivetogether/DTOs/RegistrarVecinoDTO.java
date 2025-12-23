package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrarVecinoDTO {
    private String nombre;
    private String apellidos;
    private String telefono;
    private String fechaNacimiento;
    private String numeroCuenta;
    private String dni;

    private String correo;
    private String contrasena;
}
