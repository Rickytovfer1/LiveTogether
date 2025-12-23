package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "eleccion")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Eleccion {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "motivo", nullable = false)
    private String motivo;

    @Column(name = "totalAFavor", nullable = false)
    private Integer totalAFavor;

    @Column(name = "totalEnContra", nullable = false)
    private Integer totalEnContra;

    @Column(name = "totalAbstencion", nullable = false)
    private Integer totalAbstencion;

    @Column(name = "fechaHora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "fechaHoraCreacion", nullable = false)
    private LocalDateTime fechaHoraCreacion;

    @Column(name = "abierta", nullable = false)
    private boolean abierta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad")
    private Comunidad comunidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato")
    private Vecino vecino;
}
