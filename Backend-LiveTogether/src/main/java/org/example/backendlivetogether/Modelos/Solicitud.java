package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "solicitud")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Solicitud {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_vecino", nullable = false)
    private Integer idVecino;

    @Column(name = "id_comunidad", nullable = false)
    private Integer idComunidad;

    @Column(name = "id_vivienda", nullable = false)
    private Integer idVivienda;
}
