package org.example.backendlivetogether.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backendlivetogether.Enumerados.TipoVoto;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VotoDTO {

    private TipoVoto voto;
    private Integer idEleccion;
    private Integer idVecino;
}
