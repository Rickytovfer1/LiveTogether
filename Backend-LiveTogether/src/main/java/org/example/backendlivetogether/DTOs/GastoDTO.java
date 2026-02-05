package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GastoDTO {
    private Integer id;
    private String concepto;
    private Double total;
    private Double cantidadPagada;
    private Set<Integer> pagados;
    private Set<Integer> pendientes;
    private Integer idComunidad;
}
