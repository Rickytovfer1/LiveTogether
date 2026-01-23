package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sancion")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Sancion {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "motivo", nullable = false)
    private String motivo;

    @Column(name = "sancion", nullable = false)
    private String sancion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "afectado")
    private Vecino vecinoAfectado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad")
    private Comunidad comunidad;
}
