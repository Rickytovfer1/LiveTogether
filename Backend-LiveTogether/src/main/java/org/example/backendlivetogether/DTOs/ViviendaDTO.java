package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViviendaDTO {
    private Integer id;
    private Integer numResidentes;
    private String direccionPersonal;
    private Integer idPropietario;
    private Integer idComunidad;
    private List<Integer> idVecinos;
}
