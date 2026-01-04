package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MensajeDTO {
    private Integer id;
    private String texto;
    private LocalTime hora;
    private LocalDate fecha;
    private Integer idEmisor;
    private Integer idReceptor;
    private boolean editado;
    private boolean borrado;
}
